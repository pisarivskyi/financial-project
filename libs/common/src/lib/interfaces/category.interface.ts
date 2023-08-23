export interface CategoryInterface {
  name: string;
  createdBy: string
  color: string;
  icon: string;
  parentCategory?: CategoryInterface;
  mccRangeStart?: number;
  mccRangeEnd?: number;
}
