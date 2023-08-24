import { UserInterface } from './user.interface';

export interface CategoryInterface {
  name: string;
  color: string;
  icon: string;
  parentCategory?: CategoryInterface;
  mccRangeStart?: number;
  mccRangeEnd?: number;
  createdBy: UserInterface;
}
