import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { fullAppAdeoUrl } from './miljoUtil';

const lenkeTilModiaBasertPaaFnr = (fnr: string) => {
  const path = `/sykefravaer/${fnr}`;
  return fullAppAdeoUrl(path);
};

export const formaterNavn = (navn?: string): string => {
  if (!navn) return '';
  const arr = navn.split(' ');
  const etternavn = arr.pop();
  if (arr.length > 0) {
    const fornavn = arr.join(' ');
    return `${etternavn}, ${fornavn}`;
  }
  return etternavn || '';
};

export const lenkeTilModiaEnkeltperson = (navn: string, fnr: string) => {
  return (<Lenke href={lenkeTilModiaBasertPaaFnr(fnr)}>
      {formaterNavn(navn)}
  </Lenke>);
};
