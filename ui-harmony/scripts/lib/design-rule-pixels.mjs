import fs from "node:fs/promises";
import { PNG } from "pngjs";

export async function paletteEvidence(file, grayFile) {
  const frame = PNG.sync.read(await fs.readFile(file));
  const counts = new Map();
  // Quantize the viewport to 4 bits per sRGB channel to group antialiased neighbors.
  const linear = Array.from({ length: 256 }, (_, i) =>
    i <= 10 ? i / 255 / 12.92 : ((i / 255 + 0.055) / 1.055) ** 2.4,
  );
  for (let i = 0; i < frame.data.length; i += 4) {
    const [r, g, b] = frame.data.subarray(i, i + 3);
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    const y = 0.2126 * linear[r] + 0.7152 * linear[g] + 0.0722 * linear[b];
    const gray = Math.round(255 * (y <= 0.0031308 ? 12.92 * y : 1.055 * y ** (1 / 2.4) - 0.055));
    frame.data.fill(gray, i, i + 3);
  }
  await fs.writeFile(grayFile, PNG.sync.write(frame));
  return [...counts]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key, count]) => {
      const channels = [(key >> 8) & 15, (key >> 4) & 15, key & 15].map((n) => n * 16 + 7.5);
      const hi = Math.max(...channels) / 255,
        lo = Math.min(...channels) / 255;
      const saturation = hi === lo ? 0 : (hi - lo) / (1 - Math.abs(hi + lo - 1));
      return {
        bin: key.toString(16).padStart(3, "0"),
        viewportFraction: count / (frame.width * frame.height),
        hslSaturation: saturation,
      };
    });
}
