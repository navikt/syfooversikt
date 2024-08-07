import React, { ReactElement } from 'react';
import Lenke from 'nav-frontend-lenker';
import { PersonData } from '@/api/types/personregisterTypes';
import { linkToNewHostAndPath, Subdomain } from '@/utils/miljoUtil';
import { Labels } from '@/components/Labels';
import { useAktivBruker } from '@/data/modiacontext/useAktivBruker';

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
  const isGoingToArbeidsuforhet = !!personData.arbeidsuforhetvurdering;

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

  return linkToNewHostAndPath(Subdomain.SYFOMODIAPERSON, path);
};

interface Props {
  personData: PersonData;
  personident: string;
  linkText: string;
}

export function LinkSyfomodiaperson({
  personData,
  personident,
  linkText,
}: Props): ReactElement {
  const aktivBruker = useAktivBruker();
  const onPersonClick = () => {
    aktivBruker.mutate(personident, {
      onSuccess: () => {
        window.location.href = lenkeTilModia(personData);
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Lenke
        onClick={(event) => {
          event.preventDefault();
          onPersonClick();
        }}
        href={lenkeTilModia(personData)}
      >
        {linkText}
      </Lenke>
      <Labels personData={personData} />
    </div>
  );
}
