import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

dayjs.extend(minMax);

export const toReadableDate = (dateArg: Date | null): string => {
  if (!dateArg) {
    return '';
  }

  return dayjs(dateArg).format('DD.MM.YYYY');
};

export function isPast(compareDate: Date): boolean {
  const currentDate = new Date();
  const date = new Date(compareDate);
  const isNotToday = !(
    date.getFullYear() === currentDate.getFullYear() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getDate() === currentDate.getDate()
  );
  const isInThePast = date < currentDate;
  return isNotToday && isInThePast;
}

export function isToday(compareDate: Date): boolean {
  const currentDate = new Date();
  const date = new Date(compareDate);
  return (
    date.getFullYear() === currentDate.getFullYear() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getDate() === currentDate.getDate()
  );
}

export function isFuture(compareDate: Date): boolean {
  const currentDate = new Date();
  const date = new Date(compareDate);
  return currentDate < date;
}

export const earliestDate = (dateArray: Date[]): Date | null =>
  dateArray.length > 0
    ? dayjs.min(dateArray.map((date: Date) => dayjs(date))).toDate()
    : null;

export const latestDate = (dateArray: Date[]): Date | null =>
  dateArray.length > 0
    ? dayjs.max(dateArray.map((date: Date) => dayjs(date))).toDate()
    : null;
