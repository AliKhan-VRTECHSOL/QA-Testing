type Item = {
  name: string;
  expense: number;
  color?: string;
};

function hexToRgb(hex: string): [number, number, number] {
  const parsedHex = hex.replace('#', '');
  const bigint = parseInt(parsedHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

export function assignOpacityColors(data: Item[], hexColor: string): Item[] {
  const [r, g, b] = hexToRgb(hexColor);

  // Sort by expense (descending)
  const sorted = [...data].sort((a, b) => b.expense - a.expense);

  const minOpacity = 0.4;
  const maxOpacity = 1;
  const steps = sorted.length;

  // Use a small jitter to prevent same opacities
  const jitter = 0.005;

  return sorted.map((item, index) => {
    // Invert index so that highest expense gets opacity = 1
    const relativeIndex = steps - index - 1;

    // Linearly interpolate opacity + slight jitter
    const opacity =
      minOpacity + (relativeIndex * (maxOpacity - minOpacity)) / (steps - 1) + jitter * index;

    return {
      ...item,
      color: `rgba(${r}, ${g}, ${b}, ${Math.min(opacity, 1).toFixed(3)})`,
    };
  });
}
