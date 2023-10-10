import { CategoryIconEnum } from '../enums/category-icon.enum';

export const CATEGORY_ICON_DEFINITIONS = Object.values(CategoryIconEnum).map((icon) => ({
  name: icon,
  icon: `${icon}.svg`,
}));
