import { OmitFields, SettingsInterface } from '@financial-project/common';

export type UpdateSettingsDataType = Partial<OmitFields<SettingsInterface>>;
