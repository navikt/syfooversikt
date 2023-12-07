import { expect } from 'chai';
import { toReadableDate } from '@/utils/dateUtils';

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
});
