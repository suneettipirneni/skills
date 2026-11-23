// Descriptive measurements of an opaque, already aligned and resampled image region.
// Coordinates describe pixel centers as percentages of the region's width and height.
export function appearanceMetrics(rgba, width, height, options = {}) {
  if (
    !Number.isSafeInteger(width) ||
    width < 1 ||
    !Number.isSafeInteger(height) ||
    height < 1 ||
    !Number.isSafeInteger(width * height * 4)
  ) {
    throw new RangeError("width and height must be positive safe integers");
  }
  if (
    options === null ||
    typeof options !== "object" ||
    Array.isArray(options)
  ) {
    throw new TypeError("options must be an object");
  }
  const { polarity = "dark" } = options;
  if (polarity !== "dark" && polarity !== "light") {
    throw new TypeError("polarity must be dark or light");
  }
  if (
    (!Array.isArray(rgba) && !ArrayBuffer.isView(rgba)) ||
    rgba.length !== width * height * 4
  ) {
    throw new TypeError(
      "rgba must contain exactly width * height * 4 channel values",
    );
  }

  const count = width * height;
  const lightness = new Float64Array(count);
  const colors = new Map();
  let chromaSum = 0;
  for (let i = 0; i < count; i++) {
    const offset = i * 4;
    const [r, g, b, alpha] = [
      rgba[offset],
      rgba[offset + 1],
      rgba[offset + 2],
      rgba[offset + 3],
    ];
    if (
      ![r, g, b, alpha].every(
        (value) => Number.isInteger(value) && value >= 0 && value <= 255,
      ) ||
      alpha !== 255
    ) {
      throw new TypeError(
        "rgba channels must be 8-bit integers and every pixel must be opaque",
      );
    }
    const linear = (value) => {
      const s = value / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    const red = linear(r),
      green = linear(g),
      blue = linear(b);
    const l = Math.cbrt(
      0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue,
    );
    const m = Math.cbrt(
      0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue,
    );
    const s = Math.cbrt(
      0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue,
    );
    lightness[i] =
      100 * (0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s);
    const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const bLab = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    chromaSum += 100 * Math.hypot(a, bLab);
    // Bins use the lower bound for each channel: 0, 16, ..., 240.
    const hex =
      "#" +
      [r, g, b]
        .map((value) =>
          (Math.floor(value / 16) * 16).toString(16).padStart(2, "0"),
        )
        .join("");
    colors.set(hex, (colors.get(hex) ?? 0) + 1);
  }

  const sorted = Array.from(lightness).sort((a, b) => a - b);
  const percentile = (p) => {
    const index = (sorted.length - 1) * p;
    const lower = Math.floor(index),
      upper = Math.ceil(index);
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
  };
  const background = percentile(polarity === "dark" ? 0.9 : 0.1);
  let marked = 0,
    xSum = 0,
    ySum = 0,
    edgeSum = 0,
    edgeCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x,
        value = lightness[i];
      if (
        polarity === "dark"
          ? background - value >= 10
          : value - background >= 10
      ) {
        marked++;
        xSum += x + 0.5;
        ySum += y + 0.5;
      }
      if (x + 1 < width) {
        edgeSum += Math.abs(value - lightness[i + 1]);
        edgeCount++;
      }
      if (y + 1 < height) {
        edgeSum += Math.abs(value - lightness[i + width]);
        edgeCount++;
      }
    }
  }
  return {
    medianLightness: percentile(0.5),
    tonalSpan: percentile(0.9) - percentile(0.1),
    meanChroma: chromaSum / count,
    foregroundShare: (100 * marked) / count,
    centroidX: marked ? (100 * xSum) / (marked * width) : null,
    centroidY: marked ? (100 * ySum) / (marked * height) : null,
    edgeActivity: edgeCount ? edgeSum / edgeCount : 0,
    palette: [...colors.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 4)
      .map(([hex, frequency]) => ({ hex, share: (100 * frequency) / count })),
  };
}
