import { screen } from '@testing-library/react';
import { FristDataCell } from '@/components/FristDataCell';
import React from 'react';
import { PersonData, Skjermingskode } from '@/api/types/personregisterTypes';
import { testdata } from '../data/fellesTestdata';
import { describe, expect, it } from 'vitest';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';
import { toReadableDate } from '@/utils/dateUtils';
import { addWeeks } from 'date-fns';
import { getOppfolgingsoppgave } from '@/mocks/data/personoversiktEnhetMock';
import { renderWithRouter } from '../testRenderUtils';
import { routes } from '@/routers/routes';

const defaultPersonData: PersonData = {
  navn: testdata.navn1,
  harMotebehovUbehandlet: false,
  harDialogmotesvar: false,
  skjermingskode: testdata.skjermingskode.diskresjonsmerket as Skjermingskode,
  markert: false,
  harOppfolgingsplanLPSBistandUbehandlet: false,
  tildeltEnhetId: '123',
  tildeltVeilederIdent: '234',
  harBehandlerdialogUbehandlet: false,
  behandlerBerOmBistandUbehandlet: false,
  arbeidsuforhetvurdering: null,
  friskmeldingTilArbeidsformidlingFom: null,
  senOppfolgingKandidat: null,
  oppfolgingsoppgave: null,
  aktivitetskravvurdering: null,
  manglendeMedvirkning: null,
};

const fristFormatRegex = /\b\d{2}\.\d{2}\.\d{4}\b/;

const renderFristColumn = (personData: PersonData) => {
  renderWithRouter(
    <FristDataCell personData={personData} />,
    routes.ENHET_OVERSIKT
  );
};

describe('FristColumn', () => {
  it('viser ingen frister når person har hverken aktivitetskrav AVVENT med frist eller oppfolgingsoppgave med frist', () => {
    const personUtenFrister: PersonData = { ...defaultPersonData };
    renderFristColumn(personUtenFrister);

    expect(screen.queryAllByText(fristFormatRegex)).to.be.empty;
  });

  it('viser frist for person når aktivitetskrav AVVENT med frist', () => {
    const aktivitetskravVurderingFrist = new Date('2023-12-18');
    const personAvventerMedFrist: PersonData = {
      ...defaultPersonData,
      aktivitetskravvurdering: {
        status: AktivitetskravStatus.AVVENT,
        vurderinger: [
          {
            status: AktivitetskravStatus.AVVENT,
            frist: aktivitetskravVurderingFrist,
          },
        ],
      },
    };
    renderFristColumn(personAvventerMedFrist);

    expect(screen.getByText(toReadableDate(aktivitetskravVurderingFrist))).to
      .exist;
  });

  it('viser frist for person når person har oppfolgingsoppgave', () => {
    const oppfolgingsoppgave = getOppfolgingsoppgave(new Date('2023-12-31'));
    const personOppfolgingsoppgaveMedFrist: PersonData = {
      ...defaultPersonData,
      oppfolgingsoppgave,
    };
    renderFristColumn(personOppfolgingsoppgaveMedFrist);

    expect(screen.getAllByText(toReadableDate(oppfolgingsoppgave.frist))).to
      .exist;
  });

  it('viser frist for person når friskmelding til arbeidsformidling fom-dato er satt', () => {
    const friskmeldingTilArbeidsformidlingFom = addWeeks(new Date(), 10);
    const personFriskmeldingTilArbeidsformidling: PersonData = {
      ...defaultPersonData,
      friskmeldingTilArbeidsformidlingFom,
    };
    renderFristColumn(personFriskmeldingTilArbeidsformidling);

    expect(
      screen.getByText(toReadableDate(friskmeldingTilArbeidsformidlingFom))
    ).to.exist;
  });

  it('viser frist for person med manglende medvirkning forhåndsvarsel med svarfrist', () => {
    const svarfrist = addWeeks(new Date(), 3);
    const personManglendeMedvirkning: PersonData = {
      ...defaultPersonData,
      manglendeMedvirkning: {
        varsel: {
          svarfrist: addWeeks(new Date(), 3),
        },
      },
    };
    renderFristColumn(personManglendeMedvirkning);

    expect(screen.getByText(toReadableDate(svarfrist))).to.exist;
  });

  it('viser tidligste frist først når person har flere frister', () => {
    const aktivitetskravVurderingFrist = new Date('2023-12-10');
    const oppfolgingsoppgave = getOppfolgingsoppgave(new Date('2023-12-05'));
    const friskmeldingTilArbeidsformidlingFom = addWeeks(new Date(), 10);
    const personMedFlereFrister: PersonData = {
      ...defaultPersonData,
      aktivitetskravvurdering: {
        status: AktivitetskravStatus.AVVENT,
        vurderinger: [
          {
            status: AktivitetskravStatus.AVVENT,
            frist: aktivitetskravVurderingFrist,
          },
        ],
      },
      oppfolgingsoppgave,
      friskmeldingTilArbeidsformidlingFom,
    };

    renderFristColumn(personMedFlereFrister);

    const allFrister = screen.getAllByText(fristFormatRegex);
    expect(allFrister).to.have.length(4); // 3 frister i oversikten + 1 i modal for oppfølgingsoppgave som finnes i DOM
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

  describe('aktivitetskravvurdering frister', () => {
    it('viser frist for person når aktivitetskravvurdering har frist', () => {
      const aktivitetskravVurderingFrist = new Date('2024-07-15');
      const personMedAvventerFrist: PersonData = {
        ...defaultPersonData,
        aktivitetskravvurdering: {
          status: AktivitetskravStatus.AVVENT,
          vurderinger: [
            {
              status: AktivitetskravStatus.AVVENT,
              frist: aktivitetskravVurderingFrist,
            },
          ],
        },
      };
      renderFristColumn(personMedAvventerFrist);

      expect(screen.getByText(toReadableDate(aktivitetskravVurderingFrist))).to
        .exist;
    });

    it('viser svarfrist for forhåndsvarsel når aktivitetskravvurdering har varsel', () => {
      const aktivitetskravSvarfristForhandsvarsel = new Date('2024-07-16');
      const personMedForhandsvarsel: PersonData = {
        ...defaultPersonData,
        aktivitetskravvurdering: {
          status: AktivitetskravStatus.FORHANDSVARSEL,
          vurderinger: [
            {
              status: AktivitetskravStatus.FORHANDSVARSEL,
              varsel: {
                svarfrist: aktivitetskravSvarfristForhandsvarsel,
              },
            },
          ],
        },
      };
      renderFristColumn(personMedForhandsvarsel);

      expect(
        screen.getByText(toReadableDate(aktivitetskravSvarfristForhandsvarsel))
      ).to.exist;
    });

    it('viser ikke dobbel svarfrist for forhåndsvarsel når aktivitetskravvurdering har varsel og aktivitetskravVurderingFrist har verdi', () => {
      const svarfristForhandsvarselVis = new Date('2024-07-16');
      const svarfristForhandsvarselIkkeVis = new Date('2024-07-17');
      const personMedForhandsvarsel: PersonData = {
        ...defaultPersonData,
        aktivitetskravvurdering: {
          status: AktivitetskravStatus.FORHANDSVARSEL,
          vurderinger: [
            {
              status: AktivitetskravStatus.FORHANDSVARSEL,
              varsel: {
                svarfrist: svarfristForhandsvarselVis,
              },
            },
          ],
        },
      };
      renderFristColumn(personMedForhandsvarsel);

      expect(screen.getByText(toReadableDate(svarfristForhandsvarselVis))).to
        .exist;
      expect(screen.queryByText(toReadableDate(svarfristForhandsvarselIkkeVis)))
        .to.not.exist;
    });

    it('viser ikke dobbel frist for avvent når aktivitetskravvurdering har frist og aktivitetskravVurderingFrist har verdi', () => {
      const aktivitetskravAvventFristVis = new Date('2024-07-16');
      const aktivitetskravAvventFristIkkeVis = new Date('2024-07-17');
      const personMedForhandsvarsel: PersonData = {
        ...defaultPersonData,
        aktivitetskravvurdering: {
          status: AktivitetskravStatus.AVVENT,
          vurderinger: [
            {
              status: AktivitetskravStatus.AVVENT,
              varsel: {
                svarfrist: aktivitetskravAvventFristVis,
              },
            },
          ],
        },
      };
      renderFristColumn(personMedForhandsvarsel);

      expect(screen.getByText(toReadableDate(aktivitetskravAvventFristVis))).to
        .exist;
      expect(
        screen.queryByText(toReadableDate(aktivitetskravAvventFristIkkeVis))
      ).to.not.exist;
    });
  });
});
