import { expect } from 'chai';
import { formaterNavn } from '@/utils/lenkeUtil';

describe('lenkeUtil', () => {
  describe('formaterNavn', () => {
    it('Should format name with first and last name', () => {
      const name = 'first last';
      const expected = 'First Last';
      const result = formaterNavn(name);

      expect(result).to.deep.equal(expected);
    });

    it('Should format name with first, middle and last name', () => {
      const name = 'first middle last';
      const expected = 'First Middle Last';
      const result = formaterNavn(name);

      expect(result).to.deep.equal(expected);
    });

    it('Should format name with only last name', () => {
      const name = 'last';
      const expected = 'Last';
      const result = formaterNavn(name);

      expect(result).to.deep.equal(expected);
    });

    it('Should format name with no name', () => {
      const name = '';
      const expected = '';
      const result = formaterNavn(name);

      expect(result).to.deep.equal(expected);
    });
  });
});
