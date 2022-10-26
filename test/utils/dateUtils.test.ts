import { expect } from 'chai';
import { getWeeksBetween } from '@/utils/dateUtils';

describe('dateUtils', () => {
  describe('week calculations', () => {
    it('Will calculate number of weeks between two dates', () => {
      const date1 = new Date('2022-10-01');
      const date2 = new Date('2022-10-14');
      expect(getWeeksBetween(date1, date2)).to.equal(2);
    });
  });
});
