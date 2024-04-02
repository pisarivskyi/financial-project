import { RecordTypeEnum } from '@financial-project/common';

export const RECORD_TYPE_TO_LABEL: Record<RecordTypeEnum, string> = {
  [RecordTypeEnum.Income]: 'Income',
  [RecordTypeEnum.Outcome]: 'Outcome',
};
