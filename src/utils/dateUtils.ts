import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

dayjs.extend(minMax);

export function toReadableDate(dateArg: Date | null): string {
  if (!dateArg) {
    return '';
  }
  return dayjs(dateArg).format('DD.MM.YYYY');
}

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

export function earliestDate(dateArray: Date[]): Date | null {
  if (dateArray.length > 0) {
    const minDate = dayjs.min(dateArray.map((date: Date) => dayjs(date)));
    return minDate && minDate.toDate();
  }
  return null;
}

export function latestDate(dateArray: Date[]): Date | null {
  if (dateArray.length > 0) {
    const maxDate = dayjs.max(dateArray.map((date: Date) => dayjs(date)));
    return maxDate && maxDate.toDate();
  }
  return null;
}

export function getWeeksBetween(date1: Date, date2: Date): number {
  return Math.abs(dayjs(date1).diff(date2, 'week'));
}

export function addWeeks(date: Date, numberOfWeeks: number): Date {
  return dayjs(date).add(numberOfWeeks, 'weeks').toDate();
}

export function parseDateString(dateString: string): Date | null {
  const day = dateString.slice(0, 2);
  const month = dateString.slice(2, 4);
  let year = dateString.slice(4);
  const today = new Date();

  if (!(year.length === 2 || year.length === 4)) {
    return null;
  }

  if (year.length === 2) {
    const todayYear = today.getFullYear().toString().substring(2, 4);
    year =
      parseInt(year, 10) < parseInt(todayYear, 10) ? `20${year}` : `19${year}`;
  }

  const date = new Date(`${year}-${month}-${day}`);
  if (
    date.getMonth() + 1 !== parseInt(month, 10) ||
    date.getDate() !== parseInt(day, 10)
  ) {
    return null;
  } else {
    return date;
  }
}
