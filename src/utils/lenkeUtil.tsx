import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { fullNaisUrlDefault } from './miljoUtil';
import { capitalizeFirstLetter } from './stringUtil';

const lenkeTilModiaBasertPaaFnr = (fnr: string) => {
  const path = `/sykefravaer/${fnr}`;
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

export const lenkeTilModiaEnkeltperson = (navn: string, fnr: string) => {
  return (<Lenke href={lenkeTilModiaBasertPaaFnr(fnr)} >
      {formaterNavn(navn)}
  </Lenke>);
};
