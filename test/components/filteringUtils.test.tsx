import { AgeFilterOption, filterOnAge } from '@/utils/hendelseFilteringUtils';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { createPersonDataWithName } from '../utils/hendelseFilteringUtilsTest';
import { expect } from 'chai';

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

  console.log(
    `FNR: ${twentyFiveFnr}, ${thirtyFnr}, ${thirtyFiveFnr}, ${fourtyFnr}, ${fourtyFiveFnr}`
  );

  const personregister: PersonregisterState = {
    [twentyFiveFnr]: createPersonDataWithName('Bjarne Bjarnson'),
    [thirtyFnr]: createPersonDataWithName('Vetle Vetlesen'),
    [thirtyFiveFnr]: createPersonDataWithName('Geir Geirsson'),
    [fourtyFnr]: createPersonDataWithName('Eirik Eiriksson'),
    [fourtyFiveFnr]: createPersonDataWithName('John Johnson'),
  };

  it('Filters out all people over 30 years old', () => {
    const thirtyAndUnderPersons = filterOnAge(personregister, [
      AgeFilterOption.ThirtyAndUnder,
    ]);
    expect(Object.values(thirtyAndUnderPersons).length).to.deep.equal(2);
    expect(Object.values(thirtyAndUnderPersons)[0]?.navn).to.deep.equal(
      'Bjarne Bjarnson'
    );
    expect(Object.values(thirtyAndUnderPersons)[1]?.navn).to.deep.equal(
      'Vetle Vetlesen'
    );
  });

  it('Filters out all people 30 years old and younger', () => {
    const overThirtyPersons = filterOnAge(personregister, [
      AgeFilterOption.OverThirty,
    ]);
    expect(Object.values(overThirtyPersons).length).to.deep.equal(3);
    expect(Object.values(overThirtyPersons)[0]?.navn).to.deep.equal(
      'Geir Geirsson'
    );
    expect(Object.values(overThirtyPersons)[1]?.navn).to.deep.equal(
      'Eirik Eiriksson'
    );
    expect(Object.values(overThirtyPersons)[2]?.navn).to.deep.equal(
      'John Johnson'
    );
  });

  it('Filters no persons when no age filter is selected', () => {
    const noPersonsFiltered = filterOnAge(personregister, []);
    expect(Object.values(noPersonsFiltered).length).to.deep.equal(5);
  });
});
