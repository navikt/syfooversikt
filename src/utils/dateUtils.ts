import dayjs from 'dayjs';

export const getEarliestDate = (
  date1: Date | string,
  date2: Date | string
): Date => {
  return new Date(date1) < new Date(date2) ? new Date(date1) : new Date(date2);
};

export const getWeeksBetween = (
  date1: Date | string,
  date2: Date | string
): number => {
  return Math.abs(dayjs(date1).diff(dayjs(date2), 'week'));
};

export const toReadableDate = (dateArg: Date | null): string => {
  if (!dateArg) {
    return '';
  }

  return dayjs(dateArg).format('DD.MM.YYYY');
};
