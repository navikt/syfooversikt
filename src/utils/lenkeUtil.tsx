import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { PersonData } from '../store/personregister/personregisterTypes';
import { fullNaisUrlDefault } from './miljoUtil';
import { capitalizeFirstLetter } from './stringUtil';

const lenkeTilModiaBasertPaaFnr = (fnr: string, personData: PersonData) => {
  const skalTilMoteoversikt = personData.harMotebehovUbehandlet || personData.harMoteplanleggerUbehandlet;
  const path = `/sykefravaer/${fnr}${skalTilMoteoversikt ? '/moteoversikt' : ''}`;
  return fullNaisUrlDefault('syfomodiaperson', path);
};

export const formaterNavn = (navn?: string): string => {
  if (!navn) return '';
  const nameList = navn.split(' ');

  let fullName = '';

  nameList.forEach((name, idx) => {
    if (idx > 0) {
      const spacing = ' ';
      fullName = fullName.concat(spacing);
    }
    fullName = fullName.concat(capitalizeFirstLetter(name));
  });
  return fullName;
};

export const lenkeTilModiaEnkeltperson = (personData: PersonData, fnr: string) => {
  return (<Lenke href={lenkeTilModiaBasertPaaFnr(fnr, personData)} >
      {formaterNavn(personData.navn)}
  </Lenke>);
};
