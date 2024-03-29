import React, { ReactElement } from 'react';
import Lenke from 'nav-frontend-lenker';
import { PersonData } from '@/api/types/personregisterTypes';
import { fullNaisUrlDefault } from './miljoUtil';
import { capitalizeHyphenatedWords } from './stringUtil';

export const lenkeTilModia = (personData: PersonData) => {
  let path = `/sykefravaer`;
  const isGoingToMoteoversikt =
    personData.harMotebehovUbehandlet ||
    personData.harDialogmotesvar ||
    personData.dialogmotekandidat;
  const isGoingToOppfolgingsplanOversikt =
    personData.harOppfolgingsplanLPSBistandUbehandlet;
  const isGoingToAktivitetskrav =
    personData.aktivitetskravActive ||
    personData.harAktivitetskravVurderStansUbehandlet;
  const isGoingToBehandlerdialog = personData.harBehandlerdialogUbehandlet;
  const isGoingToSykmeldinger = personData.behandlerBerOmBistandUbehandlet;
  const isGoingToArbeidsuforhet =
    personData.harArbeidsuforhetVurderAvslagUbehandlet;

  if (isGoingToOppfolgingsplanOversikt) {
    path = `${path}/oppfoelgingsplaner`;
  } else if (isGoingToMoteoversikt) {
    path = `${path}/moteoversikt`;
  } else if (isGoingToAktivitetskrav) {
    path = `${path}/aktivitetskrav`;
  } else if (isGoingToBehandlerdialog) {
    path = `${path}/behandlerdialog`;
  } else if (isGoingToSykmeldinger) {
    path = `${path}/sykmeldinger`;
  } else if (isGoingToArbeidsuforhet) {
    path = `${path}/arbeidsuforhet`;
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
