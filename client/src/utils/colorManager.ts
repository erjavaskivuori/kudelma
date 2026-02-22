import chroma from 'chroma-js';

export interface ColorRange {
  extraDark: string;
  dark: string;
  medium: string;
  light: string;
  extraLight: string;
}

export const sortColorsByLuminance = (colors: string[]): string[] => {
  return [...colors].sort((a, b) =>
    chroma(a).luminance() - chroma(b).luminance()
  );
};

// Minimum luminance for black text readability (WCAG AA ~4.5:1 contrast)
const MIN_DARK_LUMINANCE = 0.18;

export const updateColorRange = (colors: string[]): void => {
  const root = document.documentElement;
  const sortedColors = sortColorsByLuminance(colors);

  let dark = chroma(sortedColors[1]);
  if (dark.luminance() < MIN_DARK_LUMINANCE) {
    dark = dark.luminance(MIN_DARK_LUMINANCE);
  }

  root.style.setProperty('--color-extra-dark', sortedColors[0]);
  root.style.setProperty('--color-dark', sortedColors[1]);
  root.style.setProperty('--color-medium', sortedColors[2]);
  root.style.setProperty('--color-light', sortedColors[3]);
  root.style.setProperty('--color-extra-light', sortedColors[4]);

  // Popup surface — darken the darkest color but keep its hue
  const popup = chroma(sortedColors[0]).darken(0.5).desaturate(0.3).hex();
  const popupBorder = chroma(sortedColors[1]).alpha(0.3).css();
  root.style.setProperty('--color-popup', popup);
  root.style.setProperty('--color-popup-border', popupBorder);

  root.style.display = 'none';
  root.style.display = '';
};
