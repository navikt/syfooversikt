import { describe, expect, it } from 'vitest';
import { toLastnameFirstnameFormat } from '@/utils/stringUtil';

describe('lenkeUtil', () => {
  describe('formatPersonnameCorrectly', () => {
    it('Should format name with first and last name, last name first', () => {
      const name = 'first last';
      const expected = 'Last, First';
      const result = toLastnameFirstnameFormat(name);

      expect(result).to.deep.equal(expected);
    });

    it('Should format name with first, middle and last name, last name first', () => {
      const name = 'first middle last';
      const expected = 'Last, First Middle';
      const result = toLastnameFirstnameFormat(name);

      expect(result).to.deep.equal(expected);
    });

    it('Should format name with only last name', () => {
      const name = 'last';
      const expected = 'Last';
      const result = toLastnameFirstnameFormat(name);

      expect(result).to.deep.equal(expected);
    });

    it('Should format name with no name', () => {
      const name = '';
      const expected = '';
      const result = toLastnameFirstnameFormat(name);

      expect(result).to.deep.equal(expected);
    });

    it('Format names with hyphen, last name first', () => {
      const name = 'namey dash-name nameson';
      const expected = 'Nameson, Namey Dash-Name';
      const result = toLastnameFirstnameFormat(name);

      expect(result).to.deep.equal(expected);
    });

    it('Empty string when no name', () => {
      const name = '';
      const result = toLastnameFirstnameFormat(name);

      expect(result).to.deep.equal('');
    });
  });
});
