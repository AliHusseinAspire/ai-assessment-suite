import type { EventStatus } from '@/prisma/generated/client';

export const EVENT_STATUS_OPTIONS: { label: string; value: EventStatus }[] = [
  { label: 'Upcoming', value: 'UPCOMING' },
  { label: 'Ongoing', value: 'ONGOING' },
  { label: 'Past', value: 'PAST' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export const EVENT_STATUS_COLORS: Record<EventStatus, string> = {
  UPCOMING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  ONGOING: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  PAST: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const RSVP_STATUS_COLORS: Record<string, string> = {
  ATTENDING: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  MAYBE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  DECLINED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  PENDING: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
};

export const EVENT_COLORS = [
  '#0d9488', // teal-600
  '#059669', // emerald-600
  '#2563eb', // blue-600
  '#7c3aed', // violet-600
  '#dc2626', // red-600
  '#ea580c', // orange-600
  '#ca8a04', // yellow-600
  '#db2777', // pink-600
];

export const PAGE_SIZE = 10;
