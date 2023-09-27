export interface CategoryInterface {
  id: string;
  name: string;
  color: string;
  icon: string;
  parentCategory?: CategoryInterface;
  mccRangeStart?: number;
  mccRangeEnd?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
