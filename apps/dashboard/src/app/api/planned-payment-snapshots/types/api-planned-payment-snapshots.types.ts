import { InsertPlannedPaymentDataType } from '../../planned-payments/types/api-planned-payment.types';

export type InsertPlannedPaymentSnapshotDataType = InsertPlannedPaymentDataType & {
  id: string;
};
