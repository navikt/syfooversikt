import { render, screen } from '@testing-library/react';
import { FristColumn } from '@/components/FristColumn';
import React from 'react';
import { PersonData, Skjermingskode } from '@/api/types/personregisterTypes';
import { testdata } from '../data/fellesTestdata';
import { expect } from 'chai';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';
import { toReadableDate } from '@/utils/dateUtils';

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
  aktivitetskravSistVurdert: null,
  aktivitetskravActive: false,
  aktivitetskravVurderingFrist: null,
  harBehandlerdialogUbehandlet: false,
  harAktivitetskravVurderStansUbehandlet: false,
  harOppfolgingsoppgave: false,
  oppfolgingsoppgaveFrist: null,
  behandlerBerOmBistandUbehandlet: false,
  harArbeidsuforhetVurderAvslagUbehandlet: false,
  harFriskmeldingTilArbeidsformidling: false,
};

const fristFormatRegex = /\b\d{2}\.\d{2}\.\d{4}\b/;

describe('FristColumn', () => {
  it('viser ingen frister når person har hverken aktivitetskrav AVVENT med frist eller trenger oppfolging med frist', () => {
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

  it('viser frist for person når trenger oppfolging frist-dato er satt', () => {
    const trengerOppfolgingFrist = new Date('2023-12-31');
    const personTrengerOppfolgingMedFrist: PersonData = {
      ...defaultPersonData,
      oppfolgingsoppgaveFrist: trengerOppfolgingFrist,
    };
    render(<FristColumn personData={personTrengerOppfolgingMedFrist} />);

    expect(screen.getByText(toReadableDate(trengerOppfolgingFrist))).to.exist;
  });

  it('viser tidligste frist først når person har flere frister', () => {
    const aktivitetskravVurderingFrist = new Date('2023-12-10');
    const trengerOppfolgingFrist = new Date('2023-12-05');
    const personMedFlereFrister: PersonData = {
      ...defaultPersonData,
      aktivitetskrav: AktivitetskravStatus.AVVENT,
      aktivitetskravVurderingFrist: aktivitetskravVurderingFrist,
      oppfolgingsoppgaveFrist: trengerOppfolgingFrist,
    };

    render(<FristColumn personData={personMedFlereFrister} />);

    const allFrister = screen.getAllByText(fristFormatRegex);
    expect(allFrister).to.have.length(2);
    expect(allFrister[0]?.textContent).to.eq(
      toReadableDate(trengerOppfolgingFrist)
    );
    expect(allFrister[1]?.textContent).to.eq(
      toReadableDate(aktivitetskravVurderingFrist)
    );
  });
});
