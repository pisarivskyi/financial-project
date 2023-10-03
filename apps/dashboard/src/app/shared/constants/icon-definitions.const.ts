import { IconEnum } from '../enums/icon.enum';

export const ICON_DEFINITIONS = Object.values(IconEnum)
  .filter((v) => !isNaN(Number(v)))
  .map((icon) => ({
    name: icon,
    icon: `${icon}.svg`,
  }));
