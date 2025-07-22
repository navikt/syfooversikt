import { AgeFilterOption, filterOnAge } from '@/utils/hendelseFilteringUtils';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { createPersonDataWithName } from '../utils/hendelseFilteringUtilsTest';
import { describe, expect, it } from 'vitest';

describe('Filters unit tests', () => {
  const currentYear = new Date().getFullYear();
  const yearBornTwentyFive = (currentYear - 25).toString().slice(2);
  const yearBornThirty = (currentYear - 30).toString().slice(2);
  const yearBornThirtyFive = (currentYear - 35).toString().slice(2);
  const yearBornFourty = (currentYear - 40).toString().slice(2);
  const yearBornFourtyFive = (currentYear - 45).toString().slice(2);

  const twentyFiveFnr = `0101${yearBornTwentyFive}99999`;
  const thirtyFnr = `0101${yearBornThirty}99999`;
  const thirtyFiveFnr = `0101${yearBornThirtyFive}99999`;
  const fourtyFnr = `0101${yearBornFourty}99999`;
  const fourtyFiveFnr = `0101${yearBornFourtyFive}99999`;

  const personregister: PersonregisterState = {
    [twentyFiveFnr]: createPersonDataWithName('Bjarne Bjarnson'),
    [thirtyFnr]: createPersonDataWithName('Vetle Vetlesen'),
    [thirtyFiveFnr]: createPersonDataWithName('Geir Geirsson'),
    [fourtyFnr]: createPersonDataWithName('Eirik Eiriksson'),
    [fourtyFiveFnr]: createPersonDataWithName('John Johnson'),
  };

  it('Filters out all people over 30 years old', () => {
    const underThirtyPersons = filterOnAge(personregister, [
      AgeFilterOption.BelowThirty,
    ]);
    expect(Object.values(underThirtyPersons).length).to.deep.equal(1);
    expect(Object.values(underThirtyPersons)[0]?.navn).to.deep.equal(
      'Bjarne Bjarnson'
    );
  });

  it('Filters out all people 30 years old and younger', () => {
    const thirtyAndOverPersons = filterOnAge(personregister, [
      AgeFilterOption.ThirtyAndAbove,
    ]);
    expect(Object.values(thirtyAndOverPersons).length).to.deep.equal(4);
    expect(Object.values(thirtyAndOverPersons)[0]?.navn).to.deep.equal(
      'Vetle Vetlesen'
    );
    expect(Object.values(thirtyAndOverPersons)[1]?.navn).to.deep.equal(
      'Geir Geirsson'
    );
    expect(Object.values(thirtyAndOverPersons)[2]?.navn).to.deep.equal(
      'Eirik Eiriksson'
    );
    expect(Object.values(thirtyAndOverPersons)[3]?.navn).to.deep.equal(
      'John Johnson'
    );
  });

  it('Filters no persons when no age filter is selected', () => {
    const noPersonsFiltered = filterOnAge(personregister, []);
    expect(Object.values(noPersonsFiltered).length).to.deep.equal(5);
  });
});
