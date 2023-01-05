import dayjs from 'dayjs';

const ONE_WEEK_MILLIS = 7 * 24 * 60 * 60 * 1000;

export const getWeeksSinceDate = (date: Date): number => {
  const now = new Date();
  return getWeeksBetween(new Date(date), now);
};

export const getWeeksBetween = (date1: Date, date2: Date): number => {
  return Math.round(
    Math.abs(date1.getTime() - date2.getTime()) / ONE_WEEK_MILLIS
  );
};

export const toReadableDate = (dateArg: Date | null): string => {
  if (!dateArg) {
    return '';
  }

  return dayjs(dateArg).format('DD.MM.YYYY');
};
