import dayjs from 'dayjs';

export const toReadableDate = (dateArg: Date | null): string => {
  if (!dateArg) {
    return '';
  }

  return dayjs(dateArg).format('DD.MM.YYYY');
};

export function isTodayOrPast(compareDate: Date): boolean {
  const currentDate = new Date();
  const date = new Date(compareDate);

  const isSameDay =
    date.getFullYear() === currentDate.getFullYear() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getDate() === currentDate.getDate();
  const isPast = date < currentDate;

  return isSameDay || isPast;
}

export function isFuture(compareDate: Date): boolean {
  const currentDate = new Date();
  const date = new Date(compareDate);

  return currentDate < date;
}
