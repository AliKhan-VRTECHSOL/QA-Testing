import { UploadChannel } from '../../../constants';

export interface ReceiptItem {
  storeBranch: string;
  category: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subTotal: number;
  unit: string;
  receiptId: string;
  strikethrough?: boolean; // Track strikethrough state in the data
}

export interface OrderData {
  orderId: string;
  newDate: string;
  storeName: string;
  subTotal: string;
  orderStatus: string;
  inWishlist: boolean;
  uploadChannel: UploadChannel;
  reciept: ReceiptItem[];
}

export interface ReceiptSection {
  title: string;
  orderData: OrderData;
  data: ReceiptItem[];
  collapsed: boolean;
  lastUpdated?: number;
}

export interface ComponentProps {
  ListSections: ReceiptSection[];
  onItemPress?: (item: ReceiptItem) => void;
  isShoppingMode: boolean;
  setIsShoppingMode: React.Dispatch<React.SetStateAction<boolean>>;
}
