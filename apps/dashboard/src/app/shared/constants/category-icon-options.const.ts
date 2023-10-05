import { CATEGORY_ICON_DEFINITIONS } from './category-icon-definitions.const';

export const CATEGORY_ICON_OPTIONS: { label: string; value: string }[] = CATEGORY_ICON_DEFINITIONS.map((icon) => ({
  label: icon.name,
  value: icon.name,
}));
