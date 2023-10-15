import { CategoryInterface } from '@financial-project/common';

export interface CategoryNodeInterface {
  node: Partial<CategoryInterface>;
  children?: CategoryNodeInterface[];
}

export const INITIAL_CATEGORIES: CategoryNodeInterface[] = [
  {
    node: {
      name: 'root category 1',
      color: 'string',
      icon: 'string',
      createdBy: 'SYSTEM',
    },
    children: [
      {
        node: {
          name: 'subcategory 1 lv1',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          name: 'subcategory 2 lv1',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
        children: [
          {
            node: {
              name: 'subcategory 1 lv2',
              color: 'string',
              icon: 'string',
              createdBy: 'SYSTEM',
            },
          },
        ],
      },
    ],
  },
  {
    node: {
      name: 'root category 2',
      color: 'string',
      icon: 'string',
      createdBy: 'SYSTEM',
    },
  },
  {
    node: {
      name: 'root category 3',
      color: 'string',
      icon: 'string',
      createdBy: 'SYSTEM',
    },
  },
];
