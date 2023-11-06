import dayjs from 'dayjs';

export const getEarliestDate = (date1: Date, date2: Date): Date => {
  return date1 < date2 ? date1 : date2;
};

export const getWeeksBetween = (date1: Date, date2: Date): number => {
  return Math.abs(dayjs(date1).diff(date2, 'week'));
};

export const toReadableDate = (dateArg: Date | null): string => {
  if (!dateArg) {
    return '';
  }

  return dayjs(dateArg).format('DD.MM.YYYY');
};
