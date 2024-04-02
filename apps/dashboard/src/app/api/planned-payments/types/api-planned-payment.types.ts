import { OmitFields, PlannedPaymentInterface } from '@financial-project/common';

export type InsertPlannedPaymentDataType = OmitFields<Omit<PlannedPaymentInterface, 'category'>> & {
  categoryId: string;
};

export type UpdatePlannedPaymentDataType = Partial<InsertPlannedPaymentDataType>;
