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

export const updateColorRange = (colors: string[]): void => {
  const root = document.documentElement;
  const sortedColors = sortColorsByLuminance(colors);

  root.style.setProperty('--color-extra-dark', sortedColors[0]);
  root.style.setProperty('--color-dark', sortedColors[1]);
  root.style.setProperty('--color-medium', sortedColors[2]);
  root.style.setProperty('--color-light', sortedColors[3]);
  root.style.setProperty('--color-extra-light', sortedColors[4]);

  root.style.display = 'none';
  root.style.display = '';
};
