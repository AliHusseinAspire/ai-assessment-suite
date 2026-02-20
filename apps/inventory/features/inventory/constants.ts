import type { ItemStatus } from '@prisma/client';

export const ITEM_STATUSES: { value: ItemStatus; label: string; color: string }[] = [
  { value: 'IN_STOCK', label: 'In Stock', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'LOW_STOCK', label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'ORDERED', label: 'Ordered', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'DISCONTINUED', label: 'Discontinued', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
];

export const PAGE_SIZE = 10;

export const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'quantity-asc', label: 'Quantity (Low-High)' },
  { value: 'quantity-desc', label: 'Quantity (High-Low)' },
  { value: 'price-asc', label: 'Price (Low-High)' },
  { value: 'price-desc', label: 'Price (High-Low)' },
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
] as const;
