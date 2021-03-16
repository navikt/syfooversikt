import React, { ReactElement } from 'react';
import Lenke from 'nav-frontend-lenker';
import { PersonData } from '../store/personregister/personregisterTypes';
import { fullNaisUrlDefault } from './miljoUtil';
import { capitalizeFirstLetter } from './stringUtil';

const lenkeTilModiaBasertPaaFnr = (fnr: string, personData: PersonData) => {
  let path = `/sykefravaer/${fnr}`;
  const skalTilMoteoversikt =
    personData.harMotebehovUbehandlet || personData.harMoteplanleggerUbehandlet;
  const skalTilOppfolgingsplanOversikt =
    personData.harOppfolgingsplanLPSBistandUbehandlet;
  if (skalTilOppfolgingsplanOversikt) {
    path = `${path}/oppfoelgingsplaner`;
  } else if (skalTilMoteoversikt) {
    path = `${path}/moteoversikt`;
  }
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

export const lenkeTilModiaEnkeltperson = (
  personData: PersonData,
  fnr: string
): ReactElement => {
  return (
    <Lenke href={lenkeTilModiaBasertPaaFnr(fnr, personData)}>
      {formaterNavn(personData.navn)}
    </Lenke>
  );
};

export const lenkeTilModiaEnkeltpersonFnr = (
  personData: PersonData,
  fnr: string
): ReactElement | string => {
  const hasPersonName = personData.navn && personData.navn.length > 0;
  if (hasPersonName) {
    return fnr;
  }
  return <Lenke href={lenkeTilModiaBasertPaaFnr(fnr, personData)}>{fnr}</Lenke>;
};
