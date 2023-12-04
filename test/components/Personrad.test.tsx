import React from 'react';
import { testdata, veiledere } from '../data/fellesTestdata';
import { PersonData, Skjermingskode } from '@/api/types/personregisterTypes';
import { Personrad } from '@/components/Personrad';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import { formatNameCorrectly } from '@/utils/lenkeUtil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';
import { testQueryClient } from '../testQueryClient';
import { unleashQueryKeys } from '@/data/unleash/unleashQueryHooks';
import { veiledereQueryKeys } from '@/data/veiledereQueryHooks';
import { veilederMock } from '../../mock/syfoveileder/veilederMock';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { aktivEnhetMock } from '../../mock/data/aktivEnhetMock';
import { unleashMock } from '../../mock/mockUnleash';

let queryClient: QueryClient;

const renderPersonrad = (personData: PersonData) =>
  render(
    <NotificationProvider>
      <AktivEnhetContext.Provider
        value={{
          aktivEnhet: aktivEnhetMock.aktivEnhet,
          handleAktivEnhetChanged: () => void 0,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Personrad
            index={1}
            fnr={testdata.fnr1}
            veilederName={`${veiledere[0]?.etternavn}, ${veiledere[0]?.fornavn}`}
            personData={personData}
            checkboxHandler={() => void 0}
            kryssAv={false}
          />
        </QueryClientProvider>
      </AktivEnhetContext.Provider>
    </NotificationProvider>
  );

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
const personDataAktivitetskravAvventUtenFrist: PersonData = {
  ...defaultPersonData,
  aktivitetskrav: AktivitetskravStatus.AVVENT,
  aktivitetskravSistVurdert: new Date('2022-12-01'),
  aktivitetskravActive: true,
  aktivitetskravVurderingFrist: null,
};
const personDataAktivitetskravAvventMedFrist: PersonData = {
  ...personDataAktivitetskravAvventUtenFrist,
  aktivitetskravVurderingFrist: new Date('2023-04-01'),
};
const personWithOppfolgingstilfelle: PersonData = {
  ...defaultPersonData,
  latestOppfolgingstilfelle: {
    oppfolgingstilfelleStart: new Date('2023-01-01'),
    oppfolgingstilfelleEnd: new Date('2023-01-15'),
    virksomhetList: [],
  },
};

describe('Personrad', () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    queryClient.setQueryData(
      veiledereQueryKeys.veiledereInfo,
      () => veilederMock
    );
    queryClient.setQueryData(
      unleashQueryKeys.toggles(aktivEnhetMock.aktivEnhet, 'Z101010'),
      () => unleashMock
    );
  });

  it('Skal rendre riktig navn og fodselsnummer', () => {
    renderPersonrad(defaultPersonData);

    expect(
      screen.getByRole('link', {
        name: formatNameCorrectly(defaultPersonData.navn),
      })
    ).to.exist;
    expect(screen.getByText(testdata.fnr1)).to.exist;
  });

  it('Skal rendre frist-dato for aktivitetskrav AVVENT', () => {
    renderPersonrad(personDataAktivitetskravAvventMedFrist);

    expect(screen.getByText('01.04.2023')).to.exist;
  });

  it('Rendrer ingen frist-dato for aktivitetskrav AVVENT når frist mangler', () => {
    renderPersonrad(personDataAktivitetskravAvventUtenFrist);

    expect(screen.queryByText('01.04.2023')).to.not.exist;
  });

  it('Viser riktig utregning av varighet på sykefraværet', () => {
    renderPersonrad(personWithOppfolgingstilfelle);

    expect(screen.getByText('2 uker')).to.exist;
  });
});
