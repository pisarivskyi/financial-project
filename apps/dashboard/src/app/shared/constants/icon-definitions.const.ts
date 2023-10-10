import { IconEnum } from '../enums/icon.enum';

export const ICON_DEFINITIONS = Object.values(IconEnum).map((icon) => ({
  name: icon,
  icon: `${icon}.svg`,
}));
