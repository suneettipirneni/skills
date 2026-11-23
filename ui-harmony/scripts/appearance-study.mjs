#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { appearanceMetrics } from "./lib/appearance-metrics.mjs";
import { appearanceReport } from "./lib/appearance-report.mjs";

function rect(values) {
  const [x, y, width, height] = values;
  if (
    ![x, y, width, height].every(Number.isFinite) ||
    width <= 0 ||
    height <= 0
  )
    throw Error("Invalid sample rectangle");
  return { x, y, width, height };
}

function relative(box, parent) {
  return {
    x: (100 * (box.x - parent.x)) / parent.width,
    y: (100 * (box.y - parent.y)) / parent.height,
    width: (100 * box.width) / parent.width,
    height: (100 * box.height) / parent.height,
  };
}

async function elementBox(page, selector, frame, textBounds = false) {
  if (!selector) return frame;
  const locator = page.locator(selector);
  if ((await locator.count()) !== 1)
    throw Error("Expected one visible subject for " + selector);
  const box = textBounds
    ? await locator.evaluate((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        return range.getBoundingClientRect().toJSON();
      })
    : await locator.boundingBox();
  if (!box) throw Error("Hidden subject " + selector);
  const x = Math.max(frame.x, box.x),
    y = Math.max(frame.y, box.y);
  return rect([
    x,
    y,
    Math.min(frame.x + frame.width, box.x + box.width) - x,
    Math.min(frame.y + frame.height, box.y + box.height) - y,
  ]);
}

async function paintEvidence(page, client, rootId, sample) {
  const { nodeId } = await client.send("DOM.querySelector", {
    nodeId: rootId,
    selector: sample.selector,
  });
  if (!nodeId || (await page.locator(sample.selector).count()) !== 1)
    throw Error("Ambiguous or missing type sample " + sample.selector);
  const { fonts } = await client.send("CSS.getPlatformFontsForNode", {
    nodeId,
  });
  const painted = fonts.filter((font) => font.glyphCount > 0);
  if (!painted.length) throw Error("No painted glyphs for " + sample.selector);
  const properties = await page.locator(sample.selector).evaluate((el) => {
    const s = getComputedStyle(el);
    return Object.fromEntries(
      [
        "fontSize",
        "fontWeight",
        "lineHeight",
        "letterSpacing",
        "fontFamily",
        "color",
      ].map((k) => [k, s[k]]),
    );
  });
  const expected = sample.families ?? [];
  const matched = expected.length
    ? painted.every(
        (f) =>
          expected.includes(f.familyName) && (!sample.custom || f.isCustomFont),
      )
    : null;
  return { ...properties, expected, fonts: painted, matched };
}

// Decode on a separate blank page. Application layout and CSP cannot affect the samples.
async function decode(lab, bytes, key) {
  return lab.evaluate(
    async ({ data, key }) => {
      const img = new Image();
      img.src = data;
      await img.decode();
      window[key] = img;
      return { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight };
    },
    {
      data:
        "data:image/" +
        (bytes[0] === 0xff ? "jpeg" : "png") +
        ";base64," +
        bytes.toString("base64"),
      key,
    },
  );
}

async function crop(lab, key, box, file, sampleWidth) {
  const result = await lab.evaluate(
    ({ key, box, sampleWidth }) => {
      const img = window[key];
      const { x, y, width, height } = box;
      if (
        x < 0 ||
        y < 0 ||
        width <= 0 ||
        height <= 0 ||
        x + width > img.naturalWidth + 0.01 ||
        y + height > img.naturalHeight + 0.01
      )
        throw Error("Region exceeds image bounds");
      const canvas = document.createElement("canvas");
      function draw(w, h) {
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, x, y, width, height, 0, 0, w, h);
        return ctx;
      }
      draw(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));
      const png = canvas.toDataURL().split(",")[1];
      if (!sampleWidth) return { png };
      const h = Math.max(1, Math.round((height * sampleWidth) / width));
      const ctx = draw(sampleWidth, h);
      const rgba = ctx.getImageData(0, 0, sampleWidth, h).data;
      // Serialize bytes as compact base64 instead of a JSON numeric array.
      let chars = "";
      for (let i = 0; i < rgba.length; i += 8192)
        chars += String.fromCharCode(...rgba.subarray(i, i + 8192));
      return { png, rgba: btoa(chars), h };
    },
    { key, box, sampleWidth },
  );
  await fs.writeFile(file, Buffer.from(result.png, "base64"));
  return result.rgba
    ? { rgba: Buffer.from(result.rgba, "base64"), height: result.h }
    : null;
}

export async function runAppearanceStudies(
  cases,
  out,
  { channel = "chrome" } = {},
) {
  if (!Array.isArray(cases) || !cases.length)
    throw Error("Supply at least one appearance case");
  const ids = cases.map((s) => s.id);
  if (
    ids.some(
      (id) => typeof id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id),
    ) ||
    new Set(ids).size !== ids.length
  )
    throw Error("Use unique, hyphenated case IDs");
  await fs.mkdir(out, { recursive: true });
  if ((await fs.readdir(out)).length)
    throw Error("Choose an empty report directory");
  const browser = await chromium.launch({ channel });
  const results = [];
  try {
    const lab = await browser.newPage();
    for (const s of cases) {
      const item = {
        id: s.id,
        title: s.title,
        intent: s.intent,
        viewport: s.viewport,
        status: "incomplete",
        regions: [],
        errors: [],
      };
      results.push(item);
      const folder = path.join(out, s.id);
      await fs.mkdir(folder);
      const page = await browser.newPage({
        viewport: s.viewport,
        deviceScaleFactor: 1,
        offline: s.offline ?? false,
        reducedMotion: "reduce",
      });
      page.setDefaultTimeout(6000);
      try {
        page.on("pageerror", (e) => item.errors.push(e.message));
        await page.goto(s.url);
        if (s.enter) await s.enter(page);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            [...document.images]
              .filter((i) => i.loading !== "lazy" || i.complete)
              .map((i) => i.decode()),
          );
        });
        const sourceBytes = await fs.readFile(s.source);
        const sourceFrame = await decode(lab, sourceBytes, "source");
        const renderBytes = await page.screenshot({
          path: path.join(folder, "render.png"),
          animations: "disabled",
        });
        const renderFrame = await decode(lab, renderBytes, "render");
        const ref = s.sourceBox ? rect(s.sourceBox) : sourceFrame;
        const subject = await elementBox(page, s.subject, renderFrame);
        await crop(lab, "source", sourceFrame, path.join(folder, "source.png"));
        await crop(lab, "source", ref, path.join(folder, "reference.png"));
        await crop(lab, "render", subject, path.join(folder, "subject.png"));
        const client = await page.context().newCDPSession(page);
        await client.send("DOM.enable");
        await client.send("CSS.enable");
        const {
          root: { nodeId },
        } = await client.send("DOM.getDocument");
        for (const [i, r] of [
          { name: "Product region", reason: s.intent },
          ...(s.regions ?? []),
        ].entries()) {
          const sourceBox = r.box ? rect(r.box) : ref;
          const targetBox = await elementBox(
            page,
            r.selector,
            subject,
            r.textBounds,
          );
          const sourceGeometry = relative(sourceBox, ref);
          if (
            sourceGeometry.x < -0.01 ||
            sourceGeometry.y < -0.01 ||
            sourceGeometry.x + sourceGeometry.width > 100.01 ||
            sourceGeometry.y + sourceGeometry.height > 100.01
          )
            throw Error("Source landmark outside product region: " + r.name);
          const region = {
            name: r.name,
            reason: r.reason,
            polarity: r.polarity ?? s.polarity ?? "dark",
            geometry: {
              source: sourceGeometry,
              candidate: relative(targetBox, subject),
            },
            typography: null,
          };
          const width = Math.max(
            1,
            Math.min(
              192,
              Math.floor(sourceBox.width),
              Math.floor(targetBox.width),
            ),
          );
          region.sampleWidth = width;
          for (const [side, key, box] of [
            ["source", "source", sourceBox],
            ["candidate", "render", targetBox],
          ]) {
            const name = side + "-region-" + i + ".png";
            const sample = await crop(
              lab,
              key,
              box,
              path.join(folder, name),
              width,
            );
            region[side] = {
              image: s.id + "/" + name,
              metrics: appearanceMetrics(sample.rgba, width, sample.height, {
                polarity: region.polarity,
              }),
            };
          }
          if (r.type)
            region.typography = await paintEvidence(
              page,
              client,
              nodeId,
              r.type,
            );
          item.regions.push(region);
        }
        item.status = item.errors.length ? "incomplete" : "complete";
      } catch (error) {
        item.errors.push(error.message);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  await fs.writeFile(
    path.join(out, "report.json"),
    JSON.stringify(results, null, 2) + "\n",
  );
  await fs.writeFile(path.join(out, "index.html"), appearanceReport(results));
  return results;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  try {
    const { values } = parseArgs({
      options: {
        spec: { type: "string" },
        out: { type: "string" },
        channel: { type: "string" },
      },
    });
    if (!values.spec || !values.out)
      throw Error("Use --spec trusted-local.mjs --out EMPTY_DIRECTORY");
    const { default: cases } = await import(
      pathToFileURL(path.resolve(values.spec)).href
    );
    const results = await runAppearanceStudies(cases, values.out, {
      channel: values.channel,
    });
    for (const c of results) console.log(c.id, c.status, ...c.errors);
    if (
      results.some(
        (c) =>
          c.status !== "complete" ||
          c.regions.some((r) => r.typography?.matched === false),
      )
    )
      process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
