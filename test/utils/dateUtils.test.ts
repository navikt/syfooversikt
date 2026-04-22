import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isFuture,
  isPast,
  isToday,
  isWithinRange,
  toReadableDate,
} from '@/utils/dateUtils';

describe('dateUtils', () => {
  describe('readable date', () => {
    it('returns empty string if date is null', () => {
      const readableDate = toReadableDate(null);
      expect(readableDate).to.equal('');
    });
    it('returns string DD.MM.YYYY from date', () => {
      const date = new Date('2020-02-03');
      const readableDate = toReadableDate(date);
      expect(readableDate).to.equal('03.02.2020');
    });
    it('returns string DD.MM.YYYY from date with time', () => {
      const date = new Date('2020-12-01T10:12:05.913826');
      const readableDate = toReadableDate(date);
      expect(readableDate).to.equal('01.12.2020');
    });
  });

  describe('calendar day comparisons', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-28T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('treats timestamps on the same calendar day as today', () => {
      const compareDate = new Date('2026-04-28T00:00:00.000Z');

      expect(isToday(compareDate)).to.equal(true);
      expect(isPast(compareDate)).to.equal(false);
      expect(isFuture(compareDate)).to.equal(false);
    });

    it('treats timestamps on the same calendar day as within an inclusive range', () => {
      const compareDate = new Date('2026-04-28T00:00:00.000Z');

      const isDateWithinRange = isWithinRange(compareDate, {
        from: new Date('2026-04-28T18:00:00.000Z'),
        to: new Date('2026-04-28T18:00:00.000Z'),
      });

      expect(isDateWithinRange).to.equal(true);
    });
  });
});
