import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { personregister, testdata } from '../data/fellesTestdata';
import React from 'react';
import {
  getQueryClientWithMockdata,
  testQueryClient,
} from '../testQueryClient';
import OversiktTable from '@/sider/oversikt/sokeresultat/oversikttable/OversiktTable';
import {
  PersonData,
  PersonregisterState,
  Skjermingskode,
} from '@/api/types/personregisterTypes';
import {
  AktivitetskravStatus,
  AvventVurderingArsak,
  OnskerOppfolging,
  Oppfolgingsgrunn,
} from '@/api/types/personoversiktTypes';
import { toLastnameFirstnameFormat } from '@/utils/stringUtil';
import { aktivEnhetMock } from '@/mocks/data/aktivEnhetMock';
import dayjs from 'dayjs';
import { renderWithRouter } from '../testRenderUtils';
import { routes } from '@/routers/routes';

let queryClient = testQueryClient();

const defaultPersonData: PersonData = {
  navn: testdata.navn1,
  harMotebehovUbehandlet: false,
  harDialogmotesvar: false,
  skjermingskode: testdata.skjermingskode.diskresjonsmerket as Skjermingskode,
  harOppfolgingsplanLPSBistandUbehandlet: false,
  tildeltVeilederIdent: '234',
  harBehandlerdialogUbehandlet: false,
  behandlerBerOmBistandUbehandlet: false,
  arbeidsuforhetvurdering: null,
  friskmeldingTilArbeidsformidlingFom: null,
  senOppfolgingKandidat: null,
  oppfolgingsoppgave: null,
  aktivitetskravvurdering: null,
  manglendeMedvirkning: null,
  isAktivKartleggingssporsmalVurdering: false,
};
const personDataAktivitetskravAvventUtenFrist: PersonData = {
  ...defaultPersonData,
  aktivitetskravvurdering: {
    status: AktivitetskravStatus.AVVENT,
    vurderinger: [
      {
        status: AktivitetskravStatus.AVVENT,
        arsaker: [],
      },
    ],
  },
};
const personDataAktivitetskravAvventMedFrist: PersonData = {
  ...personDataAktivitetskravAvventUtenFrist,
  aktivitetskravvurdering: {
    status: AktivitetskravStatus.AVVENT,
    vurderinger: [
      {
        status: AktivitetskravStatus.AVVENT,
        frist: new Date('2023-04-01'),
        arsaker: [],
      },
    ],
  },
};
const personWithOppfolgingstilfelle: PersonData = {
  ...defaultPersonData,
  latestOppfolgingstilfelle: {
    oppfolgingstilfelleStart: new Date('2023-01-01'),
    oppfolgingstilfelleEnd: new Date('2023-01-15'),
    varighetUker: 2,
    virksomhetList: [],
  },
};

const renderOversikt = (personer: PersonregisterState) =>
  renderWithRouter(
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <AktivEnhetContext.Provider
          value={{
            aktivEnhet: aktivEnhetMock.aktivEnhet,
            handleAktivEnhetChanged: () => void 0,
          }}
        >
          <OversiktTable
            personListe={Object.entries(personer)}
            selectedRows={[]}
            setSelectedRows={() => void 0}
            setSorting={() => void 0}
            sorting={{ orderBy: 'FNR', direction: 'ascending' }}
          />
        </AktivEnhetContext.Provider>
      </QueryClientProvider>
    </NotificationProvider>,
    routes.ENHET_OVERSIKT
  );

describe('NewOversiktTable', () => {
  beforeEach(() => {
    queryClient = getQueryClientWithMockdata();
  });

  it('rendrer kolonnenavn', () => {
    renderOversikt(personregister);

    expect(screen.getByText('Navn')).to.exist;
    expect(screen.getByText('Fødselsnummer')).to.exist;
    expect(screen.getByText('Virksomhet')).to.exist;
    expect(screen.getByText('Veileder')).to.exist;
    expect(screen.getByText('Sykefravær')).to.exist;
    expect(screen.getByText('Frist/Dato')).to.exist;
    expect(screen.getByText('Hendelse')).to.exist;
  });

  it('rendrer en rad per person', () => {
    renderOversikt(personregister);

    expect(screen.getByRole('link', { name: 'Navn, Et' })).to.exist;
    expect(screen.getByRole('link', { name: 'Navn, Et Annet' })).to.exist;
  });

  it('Skal rendre riktig navn, fodselsnummer og ikon for skjermingskode', () => {
    renderOversikt({ [testdata.fnr1]: defaultPersonData });

    expect(
      screen.getByRole('link', {
        name: toLastnameFirstnameFormat(defaultPersonData.navn),
      })
    ).to.exist;
    expect(screen.getByText(testdata.fnr1)).to.exist;
    expect(screen.getByRole('img')).to.exist;
  });

  it('Rendrer ikke ikon når person mangler skjermingskode', () => {
    renderOversikt({
      [testdata.fnr1]: { ...defaultPersonData, skjermingskode: 'INGEN' },
    });

    expect(screen.queryByRole('img')).to.not.exist;
  });

  it('Skal rendre frist-dato for aktivitetskrav AVVENT', () => {
    renderOversikt({ [testdata.fnr1]: personDataAktivitetskravAvventMedFrist });

    const fristText = screen.getAllByText('01.04.2023');
    expect(fristText).to.have.lengthOf(2); // 1 in the table and 1 in the modal
  });

  it('Rendrer ingen frist-dato for aktivitetskrav AVVENT når frist mangler', () => {
    renderOversikt({
      [testdata.fnr1]: personDataAktivitetskravAvventUtenFrist,
    });

    expect(screen.queryByText('01.04.2023')).to.not.exist;
  });

  it('Viser riktig utregning av varighet på sykefraværet', () => {
    renderOversikt({ [testdata.fnr1]: personWithOppfolgingstilfelle });

    expect(screen.getByText('2 uker')).to.exist;
  });

  it('Viser hendelse for en rad', () => {
    renderOversikt({
      [testdata.fnr1]: {
        ...defaultPersonData,
        harDialogmotesvar: true,
      },
    });

    expect(screen.getByText('Dialogmøte - Nytt svar')).to.exist;
  });

  it('Viser flere hendelser for en rad', () => {
    renderOversikt({
      [testdata.fnr1]: {
        ...defaultPersonData,
        harDialogmotesvar: true,
        dialogmotekandidat: true,
        harMotebehovUbehandlet: true,
        harOppfolgingsplanLPSBistandUbehandlet: true,
        harBehandlerdialogUbehandlet: true,
        aktivitetskravvurdering: {
          status: AktivitetskravStatus.FORHANDSVARSEL,
          vurderinger: [
            {
              status: AktivitetskravStatus.FORHANDSVARSEL,
              varsel: {
                svarfrist: dayjs().add(-1, 'day').toDate(),
              },
              arsaker: [],
            },
          ],
        },
        behandlerBerOmBistandUbehandlet: true,
        friskmeldingTilArbeidsformidlingFom: dayjs().add(1, 'week').toDate(),
        arbeidsuforhetvurdering: {
          varsel: {
            svarfrist: dayjs().add(1, 'week').toDate(),
          },
        },
        senOppfolgingKandidat: {
          personident: '',
          varselAt: new Date(),
          svar: {
            svarAt: new Date(),
            onskerOppfolging: OnskerOppfolging.JA,
          },
        },
        oppfolgingsoppgave: {
          uuid: '123',
          createdBy: '432',
          updatedAt: new Date(),
          createdAt: new Date(),
          tekst: 'Oppfølgingsoppgave',
          oppfolgingsgrunn: Oppfolgingsgrunn.TA_KONTAKT_SYKEMELDT,
          frist: new Date(),
        },
        manglendeMedvirkning: {
          varsel: {
            svarfrist: dayjs().subtract(1, 'week').toDate(),
          },
        },
      },
    });

    expect(screen.getByText('Dialogmøte - Nytt svar')).to.exist;
    expect(screen.getByText('Dialogmøte - Kandidat')).to.exist;
    expect(screen.getByText('Dialogmøte - Møtebehov')).to.exist;
    expect(screen.getByText('Aktivitetskrav - Forhåndsvarsel utløpt')).to.exist;
    expect(screen.getByText('Arbeidsuførhet - Forhåndsvarsel sendt')).to.exist;
    expect(screen.getByText('Friskmelding til arbeidsformidling')).to.exist;
    expect(screen.getByText('Oppf.oppgave - Kontakt sykmeldt')).to.exist;
    expect(screen.getByText('Bistandsbehov fra behandler')).to.exist;
    expect(screen.getByText('Dialogmelding')).to.exist;
    expect(screen.getByText('Oppfølgingsplan')).to.exist;
    expect(screen.getByText('Snart slutt på sykepengene - Ønsker oppfølging'))
      .to.exist;
    expect(screen.getByText('Manglende medvirkning - Forhåndsvarsel utløpt')).to
      .exist;
  });

  it('Viser årsaker for aktivitetskravvurdering ved status AVVENT for flere personer', () => {
    renderOversikt({
      [testdata.fnr1]: {
        ...defaultPersonData,
        aktivitetskravvurdering: {
          status: AktivitetskravStatus.AVVENT,
          vurderinger: [
            {
              status: AktivitetskravStatus.AVVENT,
              arsaker: [AvventVurderingArsak.INFORMASJON_BEHANDLER],
            },
          ],
        },
      },
      [testdata.fnr2]: {
        ...defaultPersonData,
        aktivitetskravvurdering: {
          status: AktivitetskravStatus.AVVENT,
          vurderinger: [
            {
              status: AktivitetskravStatus.AVVENT,
              arsaker: [
                AvventVurderingArsak.INFORMASJON_SYKMELDT,
                AvventVurderingArsak.ANNET,
              ],
            },
          ],
        },
      },
      [testdata.fnr3]: {
        ...defaultPersonData,
        aktivitetskravvurdering: {
          status: AktivitetskravStatus.AVVENT,
          vurderinger: [
            {
              status: AktivitetskravStatus.AVVENT,
              arsaker: [],
            },
          ],
        },
      },
    });

    expect(
      screen.getByText(
        'Aktivitetskrav - Avventer (Har bedt om informasjon fra den sykemeldte, Annet)'
      )
    ).to.exist;
    expect(
      screen.getByText(
        'Aktivitetskrav - Avventer (Har bedt om mer informasjon fra behandler)'
      )
    ).to.exist;
    expect(screen.getByText('Aktivitetskrav - Avventer')).to.exist;
  });
});
