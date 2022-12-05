import React, { ReactElement } from 'react';
import Lenke from 'nav-frontend-lenker';
import { PersonData } from '@/api/types/personregisterTypes';
import { fullNaisUrlDefault } from './miljoUtil';
import { capitalizeFirstLetter } from './stringUtil';
import { trackOnClick } from '@/amplitude/amplitude';
import { hasActiveAktivitetskravStatus } from '@/utils/personDataUtil';

const texts = {
  trackingLabelNavigateToModiaPerson: 'Gå til Syfomodiaperson',
};

const lenkeTilModia = (personData: PersonData) => {
  let path = `/sykefravaer`;
  const isGoingToMoteoversikt =
    personData.harMotebehovUbehandlet ||
    personData.harDialogmotesvar ||
    personData.dialogmotekandidat;
  const isGoingToOppfolgingsplanOversikt =
    personData.harOppfolgingsplanLPSBistandUbehandlet;
  const isGoingToAktivitetskrav = hasActiveAktivitetskravStatus(personData);
  if (isGoingToOppfolgingsplanOversikt) {
    path = `${path}/oppfoelgingsplaner`;
  } else if (isGoingToMoteoversikt) {
    path = `${path}/moteoversikt`;
  } else if (isGoingToAktivitetskrav) {
    path = `${path}/aktivitetskrav`;
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
  onClick: () => void
) => {
  return (
    <Lenke
      onClick={(event) => {
        event.preventDefault();
        trackOnClick(texts.trackingLabelNavigateToModiaPerson);
        onClick();
        window.location.href = lenkeTilModia(personData);
      }}
      href={lenkeTilModia(personData)}
    >
      {formaterNavn(personData.navn)}
    </Lenke>
  );
};

export const lenkeTilModiaEnkeltpersonFnr = (
  personData: PersonData,
  fnr: string,
  onClick: () => void
): ReactElement | string => {
  const hasPersonName = personData.navn && personData.navn.length > 0;
  if (hasPersonName) {
    return fnr;
  }
  return (
    <Lenke
      onClick={(event) => {
        event.preventDefault();
        onClick();
        window.location.href = lenkeTilModia(personData);
      }}
      href={lenkeTilModia(personData)}
    >
      {fnr}
    </Lenke>
  );
};
