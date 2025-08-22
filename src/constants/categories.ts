export interface Category {
  id: string;
  name: string;
  icon: any;
  expense: number;
  color: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  title: string;
  data: Product[];
}

export interface Product {
  name: string;
  date: string;
  amount: number;
}

export const categoriesData: Category[] = [
  {
    id: '1',
    name: 'Fresh Fruits & Vegetables',
    icon: require('../assets/images/Category1.webp'),
    expense: 1930,
    color: '#4CAF50',
    subcategories: [
      {
        id: '1-1',
        title: 'Fruits',
        data: [
          { name: 'Apples', date: '2025-01-05', amount: 5.5 },
          { name: 'Bananas', date: '2025-01-06', amount: 3.2 },
          { name: 'Oranges', date: '2025-01-07', amount: 6.0 },
          { name: 'Strawberries', date: '2025-01-08', amount: 8.75 },
          { name: 'Grapes', date: '2025-01-09', amount: 4.25 },
          { name: 'Pineapple', date: '2025-01-10', amount: 7.50 },
        ],
      },
      {
        id: '1-2',
        title: 'Vegetables',
        data: [
          { name: 'Carrots', date: '2025-01-11', amount: 4.1 },
          { name: 'Spinach', date: '2025-01-12', amount: 2.75 },
          { name: 'Broccoli', date: '2025-01-13', amount: 3.5 },
          { name: 'Tomatoes', date: '2025-01-14', amount: 5.0 },
          { name: 'Onions', date: '2025-01-15', amount: 2.25 },
          { name: 'Bell Peppers', date: '2025-01-16', amount: 4.75 },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Bakery & Baked Goods',
    icon: require('../assets/images/Category2.webp'),
    expense: 2760,
    color: '#FF9800',
    subcategories: [
      {
        id: '2-1',
        title: 'Bread & Pastries',
        data: [
          { name: 'Whole Wheat Bread', date: '2025-01-17', amount: 2.5 },
          { name: 'Croissant', date: '2025-01-18', amount: 3.0 },
          { name: 'Muffins', date: '2025-01-19', amount: 4.2 },
          { name: 'Bagels', date: '2025-01-20', amount: 3.75 },
          { name: 'Sourdough Bread', date: '2025-01-21', amount: 4.50 },
        ],
      },
      {
        id: '2-2',
        title: 'Cakes & Desserts',
        data: [
          { name: 'Chocolate Cake', date: '2025-01-22', amount: 12.0 },
          { name: 'Cheesecake', date: '2025-01-23', amount: 15.5 },
          { name: 'Cupcakes', date: '2025-01-24', amount: 8.75 },
          { name: 'Cookies', date: '2025-01-25', amount: 6.25 },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Dairy & Refrigerated',
    icon: require('../assets/images/Category3.webp'),
    expense: 1340,
    color: '#2196F3',
    subcategories: [
      {
        id: '3-1',
        title: 'Milk & Dairy',
        data: [
          { name: 'Whole Milk', date: '2025-01-26', amount: 3.0 },
          { name: 'Cheese', date: '2025-01-27', amount: 7.25 },
          { name: 'Yogurt', date: '2025-01-28', amount: 4.5 },
          { name: 'Butter', date: '2025-01-29', amount: 5.75 },
          { name: 'Cream', date: '2025-01-30', amount: 3.50 },
        ],
      },
      {
        id: '3-2',
        title: 'Eggs & Alternatives',
        data: [
          { name: 'Large Eggs (12)', date: '2025-01-31', amount: 4.25 },
          { name: 'Egg Whites', date: '2025-02-01', amount: 6.0 },
          { name: 'Almond Milk', date: '2025-02-02', amount: 4.75 },
          { name: 'Soy Milk', date: '2025-02-03', amount: 3.50 },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Meat, Poultry & Seafood',
    icon: require('../assets/images/Category1.webp'),
    expense: 2500,
    color: '#F44336',
    subcategories: [
      {
        id: '4-1',
        title: 'Fresh Meat',
        data: [
          { name: 'Ground Beef', date: '2025-02-04', amount: 8.50 },
          { name: 'Chicken Breast', date: '2025-02-05', amount: 12.75 },
          { name: 'Pork Chops', date: '2025-02-06', amount: 9.25 },
          { name: 'Lamb Chops', date: '2025-02-07', amount: 15.0 },
        ],
      },
      {
        id: '4-2',
        title: 'Seafood',
        data: [
          { name: 'Salmon Fillet', date: '2025-02-08', amount: 18.50 },
          { name: 'Shrimp', date: '2025-02-09', amount: 14.25 },
          { name: 'Tuna Steak', date: '2025-02-10', amount: 12.0 },
          { name: 'Cod Fillet', date: '2025-02-11', amount: 10.75 },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'Frozen Foods & Desserts',
    icon: require('../assets/images/Category2.webp'),
    expense: 1450,
    color: '#9C27B0',
    subcategories: [
      {
        id: '5-1',
        title: 'Frozen Meals',
        data: [
          { name: 'Frozen Pizza', date: '2025-02-12', amount: 8.75 },
          { name: 'Frozen Vegetables', date: '2025-02-13', amount: 4.50 },
          { name: 'Ice Cream', date: '2025-02-14', amount: 6.25 },
          { name: 'Frozen Fish', date: '2025-02-15', amount: 9.0 },
        ],
      },
      {
        id: '5-2',
        title: 'Frozen Desserts',
        data: [
          { name: 'Ice Cream Sandwiches', date: '2025-02-16', amount: 5.50 },
          { name: 'Frozen Yogurt', date: '2025-02-17', amount: 4.75 },
          { name: 'Popsicles', date: '2025-02-18', amount: 3.25 },
        ],
      },
    ],
  },
  {
    id: '6',
    name: 'Canned & Jarred Goods',
    icon: require('../assets/images/Category3.webp'),
    expense: 2270,
    color: '#795548',
    subcategories: [
      {
        id: '6-1',
        title: 'Canned Vegetables',
        data: [
          { name: 'Canned Tomatoes', date: '2025-02-19', amount: 2.75 },
          { name: 'Canned Beans', date: '2025-02-20', amount: 1.50 },
          { name: 'Canned Corn', date: '2025-02-21', amount: 2.25 },
          { name: 'Canned Peas', date: '2025-02-22', amount: 1.75 },
        ],
      },
      {
        id: '6-2',
        title: 'Jarred Goods',
        data: [
          { name: 'Pasta Sauce', date: '2025-02-23', amount: 3.50 },
          { name: 'Pickles', date: '2025-02-24', amount: 2.25 },
          { name: 'Olives', date: '2025-02-25', amount: 4.0 },
          { name: 'Jams & Jellies', date: '2025-02-26', amount: 3.75 },
        ],
      },
    ],
  },
  {
    id: '7',
    name: 'Snacks & Packaged Foods',
    icon: require('../assets/images/Category1.webp'),
    expense: 3010,
    color: '#FF5722',
    subcategories: [
      {
        id: '7-1',
        title: 'Chips & Crackers',
        data: [
          { name: 'Potato Chips', date: '2025-02-27', amount: 4.25 },
          { name: 'Tortilla Chips', date: '2025-02-28', amount: 3.75 },
          { name: 'Crackers', date: '2025-03-01', amount: 2.50 },
          { name: 'Popcorn', date: '2025-03-02', amount: 3.0 },
        ],
      },
      {
        id: '7-2',
        title: 'Nuts & Dried Fruits',
        data: [
          { name: 'Almonds', date: '2025-03-03', amount: 8.50 },
          { name: 'Cashews', date: '2025-03-04', amount: 7.25 },
          { name: 'Raisins', date: '2025-03-05', amount: 4.0 },
          { name: 'Dried Apricots', date: '2025-03-06', amount: 5.75 },
        ],
      },
    ],
  },
  {
    id: '8',
    name: 'Beverages & Juices',
    icon: require('../assets/images/Category2.webp'),
    expense: 1690,
    color: '#00BCD4',
    subcategories: [
      {
        id: '8-1',
        title: 'Soft Drinks',
        data: [
          { name: 'Cola', date: '2025-03-07', amount: 4.0 },
          { name: 'Lemonade', date: '2025-03-08', amount: 3.50 },
          { name: 'Sparkling Water', date: '2025-03-09', amount: 2.75 },
          { name: 'Energy Drinks', date: '2025-03-10', amount: 5.25 },
        ],
      },
      {
        id: '8-2',
        title: 'Juices & Smoothies',
        data: [
          { name: 'Orange Juice', date: '2025-03-11', amount: 4.0 },
          { name: 'Apple Juice', date: '2025-03-12', amount: 3.75 },
          { name: 'Green Smoothie', date: '2025-03-13', amount: 6.50 },
          { name: 'Berry Blend', date: '2025-03-14', amount: 5.25 },
        ],
      },
    ],
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categoriesData.find(category => category.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
  return categoriesData.find(category => category.name === name);
};
