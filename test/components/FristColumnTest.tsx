import { render, screen } from '@testing-library/react';
import { FristColumn } from '@/components/FristColumn';
import React from 'react';
import { PersonData, Skjermingskode } from '@/api/types/personregisterTypes';
import { testdata } from '../data/fellesTestdata';
import { describe, expect, it } from 'vitest';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';
import { toReadableDate } from '@/utils/dateUtils';
import { addWeeks } from 'date-fns';
import { getOppfolgingsoppgave } from '../../mock/data/personoversiktEnhetMock';

const defaultPersonData: PersonData = {
  navn: testdata.navn1,
  harMotebehovUbehandlet: false,
  harDialogmotesvar: false,
  skjermingskode: testdata.skjermingskode.diskresjonsmerket as Skjermingskode,
  markert: false,
  harOppfolgingsplanLPSBistandUbehandlet: false,
  tildeltEnhetId: '123',
  tildeltVeilederIdent: '234',
  aktivitetskrav: null,
  aktivitetskravActive: false,
  aktivitetskravVurderingFrist: null,
  harBehandlerdialogUbehandlet: false,
  harAktivitetskravVurderStansUbehandlet: false,
  behandlerBerOmBistandUbehandlet: false,
  arbeidsuforhetvurdering: null,
  friskmeldingTilArbeidsformidlingFom: null,
  isAktivSenOppfolgingKandidat: false,
  oppfolgingsoppgave: null,
};

const fristFormatRegex = /\b\d{2}\.\d{2}\.\d{4}\b/;

describe('FristColumn', () => {
  it('viser ingen frister når person har hverken aktivitetskrav AVVENT med frist eller oppfolgingsoppgave med frist', () => {
    const personUtenFrister: PersonData = { ...defaultPersonData };
    render(<FristColumn personData={personUtenFrister} />);

    expect(screen.queryAllByText(fristFormatRegex)).to.be.empty;
  });

  it('viser ingen frist for person når aktivitetskrav har frist, men ikke AVVENT', () => {
    const aktivitetskravVurderingFrist = new Date('2023-12-18');
    const personForhandsvarselMedFrist: PersonData = {
      ...defaultPersonData,
      aktivitetskrav: AktivitetskravStatus.FORHANDSVARSEL,
      aktivitetskravVurderingFrist: aktivitetskravVurderingFrist,
    };
    render(<FristColumn personData={personForhandsvarselMedFrist} />);

    expect(screen.queryByText(toReadableDate(aktivitetskravVurderingFrist))).to
      .not.exist;
  });

  it('viser frist for person når aktivitetskrav AVVENT med frist', () => {
    const aktivitetskravVurderingFrist = new Date('2023-12-18');
    const personAvventerMedFrist: PersonData = {
      ...defaultPersonData,
      aktivitetskrav: AktivitetskravStatus.AVVENT,
      aktivitetskravVurderingFrist: aktivitetskravVurderingFrist,
    };
    render(<FristColumn personData={personAvventerMedFrist} />);

    expect(screen.getByText(toReadableDate(aktivitetskravVurderingFrist))).to
      .exist;
  });

  it('viser frist for person når person har oppfolgingsoppgave', () => {
    const oppfolgingsoppgave = getOppfolgingsoppgave(new Date('2023-12-31'));
    const personOppfolgingsoppgaveMedFrist: PersonData = {
      ...defaultPersonData,
      oppfolgingsoppgave,
    };
    render(<FristColumn personData={personOppfolgingsoppgaveMedFrist} />);

    expect(screen.getByText(toReadableDate(oppfolgingsoppgave.frist))).to.exist;
  });

  it('viser frist for person når friskmelding til arbeidsformidling fom-dato er satt', () => {
    const friskmeldingTilArbeidsformidlingFom = addWeeks(new Date(), 10);
    const personFriskmeldingTilArbeidsformidling: PersonData = {
      ...defaultPersonData,
      friskmeldingTilArbeidsformidlingFom,
    };
    render(<FristColumn personData={personFriskmeldingTilArbeidsformidling} />);

    expect(
      screen.getByText(toReadableDate(friskmeldingTilArbeidsformidlingFom))
    ).to.exist;
  });

  it('viser tidligste frist først når person har flere frister', () => {
    const aktivitetskravVurderingFrist = new Date('2023-12-10');
    const oppfolgingsoppgave = getOppfolgingsoppgave(new Date('2023-12-05'));
    const friskmeldingTilArbeidsformidlingFom = addWeeks(new Date(), 10);
    const personMedFlereFrister: PersonData = {
      ...defaultPersonData,
      aktivitetskrav: AktivitetskravStatus.AVVENT,
      aktivitetskravVurderingFrist: aktivitetskravVurderingFrist,
      oppfolgingsoppgave,
      friskmeldingTilArbeidsformidlingFom,
    };

    render(<FristColumn personData={personMedFlereFrister} />);

    const allFrister = screen.getAllByText(fristFormatRegex);
    expect(allFrister).to.have.length(3);
    expect(allFrister[0]?.textContent).to.eq(
      toReadableDate(oppfolgingsoppgave.frist)
    );
    expect(allFrister[1]?.textContent).to.eq(
      toReadableDate(aktivitetskravVurderingFrist)
    );
    expect(allFrister[2]?.textContent).to.eq(
      toReadableDate(friskmeldingTilArbeidsformidlingFom)
    );
  });
});
