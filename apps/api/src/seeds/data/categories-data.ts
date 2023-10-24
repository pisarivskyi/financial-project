import { CategoryInterface } from '@financial-project/common';

export interface CategoryNodeInterface {
  node: Partial<CategoryInterface>;
  children?: CategoryNodeInterface[];
}

export const INITIAL_CATEGORIES: CategoryNodeInterface[] = [
  {
    node: {
      id: 'af883cff-38d7-4464-9ad1-0403f17d7fe8',
      name: 'Housing',
      color: 'string',
      icon: 'string',
      createdBy: 'SYSTEM',
    },
    children: [
      {
        node: {
          id: '0772de13-aff4-49da-98a3-30f3e411844c',
          name: 'Rent',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '09287273-b126-40b3-99ab-104ce0e176b6',
          name: 'Household',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '10ddbc52-74d1-4bba-aade-42602420ab23',
          name: 'Mortgage',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
    ],
  },
  {
    node: {
      id: 'f32667d4-0b36-4081-ad86-eaafff0d8e4a',
      name: 'Utilities',
      color: 'string',
      icon: 'string',
      createdBy: 'SYSTEM',
    },
    children: [
      {
        node: {
          id: '3a0b7bb6-5bc7-4217-80dd-dfde5c5294e3',
          name: 'Water',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'd3b1824c-925c-41c9-b0b2-169a145355e2',
          name: 'Electricity',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'ca8aea95-3587-4574-b511-f47ba92802b7',
          name: 'Internet',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '605ea5be-10b0-4dae-9348-663f9246cb3d',
          name: 'Mobile phone',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
    ],
  },
  {
    node: {
      id: 'b65abf53-9edf-4202-b0c7-65815db6e7be',
      name: 'Transportation',
      color: 'string',
      icon: 'string',
      createdBy: 'SYSTEM',
    },
    children: [
      {
        node: {
          id: '3fe6aa80-88fa-4a1f-866d-edc2a859bef8',
          name: 'Bus tickets',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '242af595-b7f6-42f8-a7a9-6f9a6c1da7c4',
          name: 'Train tickets',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '946f487a-f87b-4702-8936-2118094368ce',
          name: 'Tram tickets',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '000f0eaf-69cc-4fa3-8337-d38eb282eb29',
          name: 'Taxi',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '1a75e7f1-a1a4-4934-bd27-0ba8ce7da378',
          name: 'Ferry tickets',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'a30f8623-316f-400f-a272-0f10b05addcf',
          name: 'Airplane tickets',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
    ],
  },
  {
    node: {
      id: '6bd20bdd-ae7b-4ee3-be69-e21de5b2a9ba',
      name: 'Personal transport',
      color: 'string',
      icon: 'string',
      createdBy: 'SYSTEM',
    },
    children: [
      {
        node: {
          id: '197e92bf-640b-48b2-a45f-413ed8c5ab6f',
          name: 'Car insurance',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '77546721-f186-4dc2-868f-f2f1feaa9dc2',
          name: 'Maintenance',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'ad70b5c9-2760-4f5c-8fd0-6ccbe4561517',
          name: 'Parking fees',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '139e538b-ad7f-440f-a824-39a1e49b006f',
          name: 'Gasoline',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '54d06885-5c96-49c1-a389-0e167ec7d3eb',
          name: 'Accessories/supplies',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
    ],
  },
  {
    node: {
      id: 'bf6ff38d-9db3-4238-aaed-0d9fa3b16717',
      name: 'Entertainment',
      color: 'string',
      icon: 'string',
      createdBy: 'SYSTEM',
    },
    children: [
      {
        node: {
          id: 'eb256eae-9328-459e-bd50-d59c1cffffa1',
          name: 'Alcohol/bars',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'b13fc395-78c8-4b44-a80f-203638ef5edb',
          name: 'Movies',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'eab572d7-90d4-4702-bf93-7bbb2ed43d6f',
          name: 'Concerts',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '5e867c13-a03b-41c5-947c-a3afb7167708',
          name: 'Subscriptions (Netflix, Spotify, etc.)',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'c32d0a5e-58a6-4947-82c1-b14b0cd898f9',
          name: 'Vacations',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
    ],
  },
  {
    node: {
      id: '30fe0739-2c82-4c42-bdb9-e6b296c27d7d',
      name: 'Gifts/Donations',
      color: 'string',
      icon: 'string',
      createdBy: 'SYSTEM',
    },
    children: [
      {
        node: {
          id: '7f09dff4-b592-467b-be93-1e9eff3d64e1',
          name: 'Birthday',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'c38c3ad6-7add-48e7-87c5-fb1cde683d64',
          name: 'Charities',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
    ],
  },
  {
    node: {
      id: 'b4de8d05-1692-4aff-84df-ce76de314590',
      name: 'Food',
      color: 'string',
      icon: 'string',
      createdBy: 'SYSTEM',
    },
    children: [
      {
        node: {
          id: '8ffece89-6880-4fce-bf45-187f4a6c7bf2',
          name: 'Groceries',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '0c1fee2e-f765-4ed9-a275-d18164d050b6',
          name: 'Restaurants',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'fb1507a2-b165-4949-aff1-ffefe5eb2635',
          name: 'Fast food',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
    ],
  },
  {
    node: {
      id: 'c06f11cb-1049-45ad-8cc6-016c72583581',
      name: 'Medical/Healthcare',
      color: 'string',
      icon: 'string',
      createdBy: 'SYSTEM',
    },
  },
  {
    node: {
      id: 'bfeea900-6f03-4ec5-93c7-8f8adaf3dc4c',
      name: 'Personal care',
      color: 'string',
      icon: 'string',
      createdBy: 'SYSTEM',
    },
    children: [
      {
        node: {
          id: '580cfa0e-4d24-48fb-b19c-d7938de1d981',
          name: 'Gym membership',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'df4d5730-d5aa-4c51-941f-1dd1da04b1fa',
          name: 'Haircuts',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '6d33fcd6-4df5-4da0-87e5-b9bc5daf6990',
          name: 'Salon services',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '73a2370f-7f73-4d20-993d-43f06732458b',
          name: 'Nails',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '7a17e403-0597-4ded-b0a7-8f932bbb2718',
          name: 'Beauty products',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
    ],
  },
  {
    node: {
      id: '146bf6a6-daee-4152-ba03-b4021277d929',
      name: 'Purchases',
      color: 'string',
      icon: 'string',
      createdBy: 'SYSTEM',
    },
    children: [
      {
        node: {
          id: '2a306e5b-1edb-41f4-92a1-54191ac23db3',
          name: 'Household items/supplies',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'eab47ae9-4464-4c99-a170-af8ce4eba9db',
          name: 'Sport goods',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'ba988852-84ac-4e54-9db3-1c641fdd1043',
          name: 'Hobby',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'd6ad3603-959f-4e0e-8dea-18c388440c3c',
          name: 'Electronics/devices',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: '3a1f7bd1-3ce1-456b-8aed-1f769c06bf30',
          name: 'Software',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'ba5f0e13-03fb-493b-9a51-1400e9414247',
          name: 'Games',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
      {
        node: {
          id: 'c80764d9-8890-4efe-9200-23e8c7e07907',
          name: 'Clothing',
          color: 'string',
          icon: 'string',
          createdBy: 'SYSTEM',
        },
      },
    ],
  },
];
