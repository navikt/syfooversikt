import { AgeFilterOption, filterOnAge } from '@/utils/hendelseFilteringUtils';
import { PersonregisterState } from '@/api/types/personregisterTypes';
import { createPersonDataWithName } from '../utils/hendelseFilteringUtilsTest';
import { describe, expect, it } from 'vitest';

describe('Filters unit tests', () => {
  function getBirthDateYearsAgo(yearOffset: number, dayOffset = 0): Date {
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - yearOffset);
    birthDate.setDate(birthDate.getDate() - dayOffset);

    return birthDate;
  }

  const personregister: PersonregisterState = {
    a: createPersonDataWithName('Bjarne Bjarnson', getBirthDateYearsAgo(25)),
    b: createPersonDataWithName('Vetle Vetlesen', getBirthDateYearsAgo(30)),
    c: createPersonDataWithName('Geir Geirsson', getBirthDateYearsAgo(35)),
    d: createPersonDataWithName('Eirik Eiriksson', getBirthDateYearsAgo(40)),
    e: createPersonDataWithName('John Johnson', getBirthDateYearsAgo(45)),
    f: createPersonDataWithName('Tiril Tirilsen', getBirthDateYearsAgo(30, -1)),
    g: createPersonDataWithName(
      'Kåre-André Kåre-Andrésen',
      getBirthDateYearsAgo(30, 1)
    ),
  };

  it('Filters out all people over 30 years old', () => {
    const underThirtyPersons = filterOnAge(personregister, [
      AgeFilterOption.BelowThirty,
    ]);
    expect(Object.values(underThirtyPersons).length).to.deep.equal(2);
    expect(Object.values(underThirtyPersons)[0]?.navn).to.deep.equal(
      'Bjarne Bjarnson'
    );
    expect(Object.values(underThirtyPersons)[1]?.navn).to.deep.equal(
      'Tiril Tirilsen'
    );
  });

  it('Filters out all people 30 years old and younger', () => {
    const thirtyAndOverPersons = filterOnAge(personregister, [
      AgeFilterOption.ThirtyAndAbove,
    ]);
    expect(Object.values(thirtyAndOverPersons).length).to.deep.equal(5);
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
    expect(Object.values(thirtyAndOverPersons)[4]?.navn).to.deep.equal(
      'Kåre-André Kåre-Andrésen'
    );
  });

  it('Filters no persons when no age filter is selected', () => {
    const noPersonsFiltered = filterOnAge(personregister, []);
    expect(Object.values(noPersonsFiltered).length).to.deep.equal(7);
  });
});
