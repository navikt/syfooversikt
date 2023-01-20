import { expect } from 'chai';
import { uppercaseFirstLetter } from '@/utils/stringUtil';

describe('stringUtil', () => {
  describe('uppercaseFirstLetter', () => {
    it('Should capitalize word', () => {
      const name = 'name';
      const expected = 'Name';
      const result = uppercaseFirstLetter(name);

      expect(result).to.deep.equal(expected);
    });
  });
});
