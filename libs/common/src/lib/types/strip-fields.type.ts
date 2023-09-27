export type OmitFields<T extends { id: string; createdAt: Date; updatedAt: Date; createdBy: string }> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy'
>;
