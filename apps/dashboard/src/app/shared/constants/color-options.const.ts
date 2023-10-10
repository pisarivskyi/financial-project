// https://medialab.github.io/iwanthue/
const colors = [
  '#c6437c',
  '#7ad847',
  '#713cc8',
  '#ccd44b',
  '#cd4ac5',
  '#74d88f',
  '#54266e',
  '#d4a23c',
  '#6a6dd0',
  '#e05426',
  '#83d7d1',
  '#c73f42',
  '#55893a',
  '#c382c4',
  '#334428',
  '#cdb7d0',
  '#392235',
  '#cfcc98',
  '#55597c',
  '#c87746',
  '#679ece',
  '#71322d',
  '#608c7c',
  '#c38384',
  '#857239',
];

export const COLOR_OPTIONS: { label: string; value: string }[] = colors.map((color) => ({
  label: color,
  value: color,
}));
