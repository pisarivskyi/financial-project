import { RecordInterface } from '@financial-project/common';

export type UpdateRecordDataType = Partial<Pick<RecordInterface, 'name' | 'comment'> & { categoryId: string }>;
