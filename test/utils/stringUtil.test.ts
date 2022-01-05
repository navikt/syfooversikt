import { expect } from 'chai';
import { capitalizeFirstLetter } from '@/utils/stringUtil';

describe('stringUtil', () => {
  describe('capitalizeFirstLetter', () => {
    it('Should capitalize word', () => {
      const name = 'name';
      const expected = 'Name';
      const result = capitalizeFirstLetter(name);

      expect(result).to.deep.equal(expected);
    });
  });
});
