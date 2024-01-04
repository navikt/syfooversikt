import dayjs from 'dayjs';

export const toReadableDate = (dateArg: Date | null): string => {
  if (!dateArg) {
    return '';
  }

  return dayjs(dateArg).format('DD.MM.YYYY');
};

export function isPast(compareDate: Date): boolean {
  const currentDate = new Date();
  const date = new Date(compareDate);
  return date < currentDate;
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
