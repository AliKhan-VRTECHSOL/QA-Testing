import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Intervals, UploadChannel, UploadChannelDescription } from '../constants';
dayjs.extend(relativeTime);

export type FormatType = 'shortDate' | 'longDate' | 'timeAgo';

export const formatDate = (
  date: Date | string = new Date(),
  formatType: FormatType = 'shortDate',
  removeInPrefix: boolean = false,
): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  switch (formatType) {
    case 'shortDate':
      return parsedDate.toLocaleDateString('en-US', {
        // weekday: 'short',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

    case 'longDate':
      return parsedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });

    case 'timeAgo': {
      const result = dayjs(parsedDate).fromNow();
      return removeInPrefix && result.startsWith('in ') ? result.replace(/^in\s+/i, '') : result;
    }

    default:
      return parsedDate.toISOString();
  }
};

export function getSingleHumanReadableEnum(value: string): string {
  return value
    .replace(/-/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

export function getHumanReadableEnums<T extends Record<string, string>>(enumObj: T): string[] {
  return Object.values(enumObj).map(getSingleHumanReadableEnum);
}

export function getEnumKeyFromLabel<T extends Record<string, string>>(
  enumObj: T,
  label: string,
): keyof T | undefined {
  const normalized = label.trim().toUpperCase().replace(/ /g, '-');
  return (Object.keys(enumObj) as Array<keyof T>).find(key => enumObj[key] === normalized);
}

function isUploadChannelKey(key: string): key is keyof typeof UploadChannel {
  return key in UploadChannel;
}

export function getUploadChannelDescription(key: string): string {
  return isUploadChannelKey(key) ? UploadChannelDescription[UploadChannel[key]] : 'NOT FOUND';
}

export const generateRandomProduct = (storeIndex?: number) => {
  const branches = ['Downtown', 'Uptown', 'Suburb', 'City Center', 'West End'];
  const categories = ['Beverages', 'Snacks', 'Bakery', 'Dairy', 'Produce', 'Frozen'];
  const products = {
    Beverages: ['Orange Juice', 'Cola', 'Green Tea', 'Mineral Water'],
    Snacks: ['Potato Chips', 'Chocolate Bar', 'Trail Mix', 'Popcorn'],
    Bakery: ['Whole Wheat Bread', 'Croissant', 'Bagel', 'Muffin'],
    Dairy: ['Milk', 'Cheese', 'Yogurt', 'Butter'],
    Produce: ['Bananas', 'Apples', 'Tomatoes', 'Carrots'],
    Frozen: ['Ice Cream', 'Frozen Pizza', 'French Fries', 'Veggie Mix'],
  };
  const units = ['bottle', 'pack', 'loaf', 'liter', 'kg', 'box'];

  const category = categories[Math.floor(Math.random() * categories.length)];
  const productList = products[category as keyof typeof products];
  const productName = productList[Math.floor(Math.random() * productList.length)];
  const unitPrice = parseFloat((Math.random() * 20 + 1).toFixed(2)); // $1 - $20
  const quantity = Math.floor(Math.random() * 10) + 1; // 1 - 10
  const subTotal = parseFloat((unitPrice * quantity).toFixed(2));

  // Use storeIndex to ensure different stores for different images
  const storeBranch = storeIndex !== undefined
    ? branches[storeIndex % branches.length]
    : branches[Math.floor(Math.random() * branches.length)];

  return {
    storeBranch,
    category,
    productName,
    unitPrice,
    quantity,
    subTotal,
    unit: units[Math.floor(Math.random() * units.length)],
  };
};

// Generate multiple products for a single store
export const generateRandomReceipt = (storeIndex?: number) => {
  const numProducts = Math.floor(Math.random() * 10) + 1; // 1-10 products per store
  const products = [];

  for (let i = 0; i < numProducts; i++) {
    products.push(generateRandomProduct(storeIndex));
  }

  return products;
};
