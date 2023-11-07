import { expect } from 'chai';
import {
  getEarliestDate,
  getWeeksBetween,
  toReadableDate,
} from '@/utils/dateUtils';

describe('dateUtils', () => {
  describe('Calculations', () => {
    it('Will calculate number of weeks between two dates', () => {
      const date1 = new Date('2022-10-01');
      const date2 = new Date('2022-10-15');
      expect(getWeeksBetween(date1, date2)).to.equal(2);
    });
    it('Will calculate earliest date', () => {
      const earliesDate = new Date('2023-01-01');
      const latestDate = new Date('2023-02-02');
      expect(getEarliestDate(earliesDate, latestDate)).to.equal(earliesDate);
    });
  });
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
});
