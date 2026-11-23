import test from "node:test";
import assert from "node:assert/strict";
import { appearanceMetrics } from "../lib/appearance-metrics.mjs";

const rgba = (colors) =>
  Uint8Array.from(colors.flatMap((color) => [...color, 255]));
const black = [0, 0, 0],
  white = [255, 255, 255];
const near = (actual, expected, tolerance = 0.0001) =>
  assert.ok(
    Math.abs(actual - expected) < tolerance,
    `${actual} is not near ${expected}`,
  );

test("a solid opaque surface has no foreground, tonal span, or edges", () => {
  const result = appearanceMetrics(rgba(Array(4).fill(white)), 2, 2);
  near(result.medianLightness, 100);
  near(result.tonalSpan, 0);
  near(result.meanChroma, 0);
  assert.equal(result.foregroundShare, 0);
  assert.equal(result.centroidX, null);
  assert.equal(result.centroidY, null);
  assert.equal(result.edgeActivity, 0);
  assert.deepEqual(result.palette, [{ hex: "#f0f0f0", share: 100 }]);
});

test("polarity reversal preserves foreground area and position", () => {
  const dark = appearanceMetrics(rgba([black, white, white, white]), 2, 2);
  const light = appearanceMetrics(rgba([white, black, black, black]), 2, 2, {
    polarity: "light",
  });
  for (const result of [dark, light]) {
    assert.equal(result.foregroundShare, 25);
    assert.equal(result.centroidX, 25);
    assert.equal(result.centroidY, 25);
    near(result.tonalSpan, 70);
    near(result.edgeActivity, 50);
  }
});

test("palette bins combine nearby colors and report area relative to all pixels", () => {
  const pixels = [
    [1, 2, 3],
    [15, 15, 15],
    [32, 48, 64],
    [80, 96, 112],
    [128, 144, 160],
    [176, 192, 208],
  ];
  const result = appearanceMetrics(rgba(pixels), 6, 1);
  assert.deepEqual(result.palette, [
    { hex: "#000000", share: 100 / 3 },
    { hex: "#203040", share: 100 / 6 },
    { hex: "#506070", share: 100 / 6 },
    { hex: "#8090a0", share: 100 / 6 },
  ]);
  assert.ok(result.meanChroma > 0);
});

test("edge activity distinguishes equal palettes with different spatial rhythm", () => {
  const blocks = appearanceMetrics(
    rgba([black, black, black, white, white, white]),
    6,
    1,
  );
  const alternating = appearanceMetrics(
    rgba([black, white, black, white, black, white]),
    6,
    1,
  );
  assert.deepEqual(blocks.palette, alternating.palette);
  near(blocks.edgeActivity, 20);
  near(alternating.edgeActivity, 100);
});

test("rejects invalid dimensions, pixel values, transparency, and polarity", () => {
  assert.throws(
    () => appearanceMetrics(rgba([white]), 0, 1),
    /width and height/,
  );
  assert.throws(
    () => appearanceMetrics(rgba([white]), 1, 1.5),
    /width and height/,
  );
  assert.throws(() => appearanceMetrics([255, 255, 255], 1, 1), /rgba/);
  assert.throws(() => appearanceMetrics([255, 255, 255, 254], 1, 1), /opaque/);
  assert.throws(() => appearanceMetrics([256, 255, 255, 255], 1, 1), /8-bit/);
  assert.throws(
    () => appearanceMetrics(rgba([white]), 1, 1, { polarity: "other" }),
    /polarity/,
  );
  assert.throws(() => appearanceMetrics(rgba([white]), 1, 1, null), /options/);
});
