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

export const earliestDate = (dateArray: Date[]): Date | null => {
  if (dateArray.length > 0) {
    const minDate = dayjs.min(dateArray.map((date: Date) => dayjs(date)));
    return minDate && minDate.toDate();
  }

  return null;
};

export const latestDate = (dateArray: Date[]): Date | null => {
  if (dateArray.length > 0) {
    const maxDate = dayjs.max(dateArray.map((date: Date) => dayjs(date)));
    return maxDate && maxDate.toDate();
  }

  return null;
};

export const getWeeksBetween = (date1: Date, date2: Date): number => {
  return Math.abs(dayjs(date1).diff(date2, 'week'));
};

export const addWeeks = (date: Date, numberOfWeeks: number): Date => {
  return dayjs(date).add(numberOfWeeks, 'weeks').toDate();
};
