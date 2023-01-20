import { expect } from 'chai';
import { formatNameCorrectly } from '@/utils/lenkeUtil';

describe('lenkeUtil', () => {
  describe('formatNameCorrectly', () => {
    it('Should format name with first and last name, last name first', () => {
      const name = 'first last';
      const expected = 'Last, First';
      const result = formatNameCorrectly(name);

      expect(result).to.deep.equal(expected);
    });

    it('Should format name with first, middle and last name, last name first', () => {
      const name = 'first middle last';
      const expected = 'Last, First Middle';
      const result = formatNameCorrectly(name);

      expect(result).to.deep.equal(expected);
    });

    it('Should format name with only last name', () => {
      const name = 'last';
      const expected = 'Last';
      const result = formatNameCorrectly(name);

      expect(result).to.deep.equal(expected);
    });

    it('Should format name with no name', () => {
      const name = '';
      const expected = '';
      const result = formatNameCorrectly(name);

      expect(result).to.deep.equal(expected);
    });

    it('Format names with hyphen, last name first', () => {
      const name = 'namey dash-name nameson';
      const expected = 'Nameson, Namey Dash-Name';
      const result = formatNameCorrectly(name);

      expect(result).to.deep.equal(expected);
    });
  });
});
