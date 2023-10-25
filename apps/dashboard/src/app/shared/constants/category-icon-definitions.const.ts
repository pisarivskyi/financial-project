import { CategoryIconEnum } from '@financial-project/common';

export const CATEGORY_ICON_DEFINITIONS = Object.values(CategoryIconEnum).map((icon) => ({
  name: icon,
  icon: `${icon}.svg`,
}));
