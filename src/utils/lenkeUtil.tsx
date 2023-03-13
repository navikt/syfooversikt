import React, { ReactElement } from 'react';
import Lenke from 'nav-frontend-lenker';
import { PersonData } from '@/api/types/personregisterTypes';
import { fullNaisUrlDefault } from './miljoUtil';
import { capitalizeHyphenatedWords } from './stringUtil';
import { trackOnClick } from '@/amplitude/amplitude';
import { hasActiveAktivitetskravStatus } from '@/utils/personDataUtil';

const texts = {
  trackingLabelNavigateToModiaPerson: 'Gå til Syfomodiaperson',
};

export const lenkeTilModia = (personData: PersonData) => {
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

export const formatNameCorrectly = (navn?: string): string => {
  if (!navn) return '';
  const nameList = navn.split(' ');

  if (nameList.length > 1) {
    const lastName = nameList.pop() || '';
    nameList.unshift(`${lastName},`);
  }

  return nameList.map(capitalizeHyphenatedWords).join(' ');
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
      }}
      href={lenkeTilModia(personData)}
    >
      {formatNameCorrectly(personData.navn)}
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
      }}
      href={lenkeTilModia(personData)}
    >
      {fnr}
    </Lenke>
  );
};
