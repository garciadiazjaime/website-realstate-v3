export const interpolateColor = (
  value: number,
  minValue: number = 100_000,
  maxValue: number = 500_000,
  startColor: string = "#00f000",
  endColor: string = "#f00000"
) => {
  // Ensure value is within the range
  const normalizedValue = Math.min(Math.max(value, minValue), maxValue);

  // Calculate the interpolation factor (0 to 1)
  const factor = (normalizedValue - minValue) / (maxValue - minValue);

  // Convert hex colors to RGB
  const startRGB = hexToRgb(startColor);
  const endRGB = hexToRgb(endColor);

  // Interpolate each color channel
  const r = Math.round(startRGB.r + factor * (endRGB.r - startRGB.r));
  const g = Math.round(startRGB.g + factor * (endRGB.g - startRGB.g));
  const b = Math.round(startRGB.b + factor * (endRGB.b - startRGB.b));

  // Return the interpolated color as a hex string
  return rgbToHex(r, g, b);
};

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};

export const loggerInfo = (message: string, metadata: object) => {
  console.log(message, metadata);
};
