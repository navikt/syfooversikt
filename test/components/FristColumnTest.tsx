import { render, screen } from '@testing-library/react';
import { FristColumn } from '@/components/FristColumn';
import React from 'react';
import { PersonData, Skjermingskode } from '@/api/types/personregisterTypes';
import { testdata } from '../data/fellesTestdata';
import { expect } from 'chai';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';

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
  trengerOppfolging: false,
  trengerOppfolgingFrist: null,
  behandlerBerOmBistandUbehandlet: false,
};

describe('FristColumn', () => {
  it('viser ingen frister når person har hverken aktivitetskrav AVVENT med frist eller trenger oppfolging med frist', () => {
    const personAvventerMedFrist: PersonData = { ...defaultPersonData };
    render(<FristColumn personData={personAvventerMedFrist} />);

    expect(screen.queryAllByText(/2023/)).to.be.empty;
  });
  it('viser frist for person når aktivitetskrav AVVENT med frist', () => {
    const personAvventerMedFrist: PersonData = {
      ...defaultPersonData,
      aktivitetskrav: AktivitetskravStatus.AVVENT,
      aktivitetskravVurderingFrist: new Date('2023-12-18'),
    };
    render(<FristColumn personData={personAvventerMedFrist} />);

    expect(screen.getByText('18.12.2023')).to.exist;
  });
  it('viser frist for person når trenger oppfolging frist-dato er satt', () => {
    const personTrengerOppfolgingMedFrist: PersonData = {
      ...defaultPersonData,
      trengerOppfolgingFrist: new Date('2023-12-31'),
    };
    render(<FristColumn personData={personTrengerOppfolgingMedFrist} />);

    expect(screen.getByText('31.12.2023')).to.exist;
  });
  it('viser tidligste frist først når person har flere frister', () => {
    const personMedFlereFrister: PersonData = {
      ...defaultPersonData,
      aktivitetskrav: AktivitetskravStatus.AVVENT,
      aktivitetskravVurderingFrist: new Date('2023-12-10'),
      trengerOppfolgingFrist: new Date('2023-12-05'),
    };

    render(<FristColumn personData={personMedFlereFrister} />);

    const allFrister = screen.getAllByText(/2023/);
    expect(allFrister).to.have.length(2);
    expect(allFrister[0]?.textContent).to.eq('05.12.2023');
    expect(allFrister[1]?.textContent).to.eq('10.12.2023');
  });
});
