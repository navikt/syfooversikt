import React, { ReactElement } from 'react';
import { PersonData } from '@/api/types/personregisterTypes';
import { linkToNewHostAndPath, Subdomain } from '@/utils/miljoUtil';
import { Labels } from '@/components/Labels';
import { useAktivBruker } from '@/data/modiacontext/useAktivBruker';
import { Link } from '@navikt/ds-react';
import * as Amplitude from '@/utils/amplitude';
import { EventType } from '@/utils/amplitude';

export function lenkeTilModia(personData: PersonData): string {
  let path = `/sykefravaer`;
  const isGoingToMoteoversikt =
    personData.harMotebehovUbehandlet ||
    personData.harDialogmotesvar ||
    personData.dialogmotekandidat;
  const isGoingToOppfolgingsplanOversikt =
    personData.harOppfolgingsplanLPSBistandUbehandlet;
  const isGoingToAktivitetskrav = !!personData.aktivitetskravvurdering;
  const isGoingToBehandlerdialog = personData.harBehandlerdialogUbehandlet;
  const isGoingToSykmeldinger = personData.behandlerBerOmBistandUbehandlet;
  const isGoingToArbeidsuforhet = !!personData.arbeidsuforhetvurdering;
  const isGoingToSenOppfolging = !!personData.senOppfolgingKandidat;
  const isGoingToManglendeMedvirkning = !!personData.manglendeMedvirkning;
  const isGoingToFrisktilarbeid = !!personData.friskmeldingTilArbeidsformidlingFom;
  const isGoingToKartleggingssporsmal =
    personData.isAktivKartleggingssporsmalVurdering;

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
  } else if (isGoingToSenOppfolging) {
    path = `${path}/senoppfolging`;
  } else if (isGoingToManglendeMedvirkning) {
    path = `${path}/manglendemedvirkning`;
  } else if (isGoingToFrisktilarbeid) {
    path = `${path}/frisktilarbeid`;
  } else if (isGoingToKartleggingssporsmal) {
    path = `${path}/kartleggingssporsmal`;
  }

  return linkToNewHostAndPath(Subdomain.SYFOMODIAPERSON, path);
}

function logNavigation(destinasjon: string) {
  Amplitude.logEvent({
    type: EventType.Navigation,
    data: {
      fromUrl: window.location.href,
      lenketekst: 'personnavn',
      destinasjon: destinasjon,
    },
  });
}

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
        const destinasjon = lenkeTilModia(personData);
        logNavigation(destinasjon);
        window.location.href = destinasjon;
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        onClick={(event) => {
          event.preventDefault();
          onPersonClick();
        }}
        href={lenkeTilModia(personData)}
      >
        {linkText}
      </Link>
      <Labels personData={personData} />
    </div>
  );
}
