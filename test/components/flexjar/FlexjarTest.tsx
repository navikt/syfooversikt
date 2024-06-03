import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import nock from 'nock';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Flexjar } from '@/components/flexjar/Flexjar';
import { expect } from 'chai';
import { defaultErrorTexts } from '@/api/errors';
import { FlexjarFeedbackDTO } from '@/data/flexjar/useFlexjarFeedback';
import { StoreKey } from '@/hooks/useLocalStorageState';
import { aktivEnhetMock } from '../../../mock/data/aktivEnhetMock';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { testQueryClient } from '../../testQueryClient';
import { veiledereQueryKeys } from '@/data/veiledereQueryHooks';
import { veilederMock } from '../../../mock/syfoveileder/veilederMock';
import { stubFlexjarApiError, stubFlexjarApiOk } from '../../stubs/stubFlexjar';

let queryClient: QueryClient;

const renderFlexjar = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <AktivEnhetContext.Provider
        value={{
          aktivEnhet: aktivEnhetMock.aktivEnhet,
          handleAktivEnhetChanged: () => void 0,
        }}
      >
        <Flexjar side={'Test'} />
      </AktivEnhetContext.Provider>
    </QueryClientProvider>
  );

const clickOption = async (label: string, expectSelected = true) => {
  const formOption = await screen.findByRole('option', { name: label });
  await userEvent.click(formOption);
  if (expectSelected) {
    await screen.findByRole('button', { name: `${label} slett` });
  }
};

describe('Flexjar', () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    queryClient.setQueryData(
      veiledereQueryKeys.veiledereInfo,
      () => veilederMock
    );
  });
  afterEach(() => {
    nock.cleanAll();
    localStorage.setItem(StoreKey.FLEXJAR_ARENABRUK_FEEDBACK_DATE, '');
  });

  it('renders open flexjar and feedback button', () => {
    renderFlexjar();
    expect(screen.getByRole('button', { name: 'Vi ønsker å lære av deg' })).to
      .exist;
    expect(
      screen.getByText('Bruker du Arena til daglig i sykefraværsoppfølgingen?')
    ).to.exist;
  });

  it('renders feedback form content after radiobutton click Ja', () => {
    renderFlexjar();
    const radio = screen.getByRole('radio', { name: 'Ja' });
    radio.click();

    expect(screen.getByText('Hva bruker du Arena til? (Velg gjerne flere)')).to
      .exist;
    expect(screen.getByText('Noe annet du bruker Arena til? (valgfritt)')).to
      .exist;
    expect(
      screen.getByText('Ikke skriv inn navn eller andre personopplysninger.')
    ).to.exist;
    expect(screen.getByRole('textbox')).to.exist;
    expect(screen.getByRole('button', { name: 'Send' })).to.exist;
  });

  it('renders feedback form content after radiobutton click Nei', () => {
    renderFlexjar();
    const radio = screen.getByRole('radio', { name: 'Nei' });
    radio.click();

    expect(
      screen.getByText(
        'Har du noen andre tilbakemeldinger til oss? (valgfritt)'
      )
    ).to.exist;
    expect(
      screen.getByText('Ikke skriv inn navn eller andre personopplysninger.')
    ).to.exist;
    expect(screen.getByRole('textbox')).to.exist;
    expect(screen.getByRole('button', { name: 'Send' })).to.exist;
  });

  it('sends tilbakemelding when radio selected', async () => {
    renderFlexjar();
    stubFlexjarApiOk();

    const radio = screen.getByRole('radio', { name: 'Ja' });
    radio.click();

    const sendButton = screen.getByRole('button', {
      name: 'Send',
    });
    sendButton.click();

    expect(await screen.findByRole('img', { name: 'Suksess' })).to.exist;
    expect(await screen.findByText('Takk for din tilbakemelding!')).to.exist;
  });

  it('does not send tilbakemelding when error', async () => {
    renderFlexjar();
    stubFlexjarApiError();

    const radio = screen.getByRole('radio', { name: 'Ja' });
    radio.click();

    const sendButton = screen.getByRole('button', {
      name: 'Send',
    });
    sendButton.click();

    expect(await screen.findByRole('img', { name: 'Feil' })).to.exist;
    expect(await screen.findByText(defaultErrorTexts.generalError)).to.exist;
    expect(screen.queryByText('Takk for din tilbakemelding!')).to.not.exist;
  });

  it('sends feedback to flexjar when radio Ja with options', async () => {
    renderFlexjar();

    const radio = screen.getByRole('radio', { name: 'Ja' });
    radio.click();

    const combobox = screen.getByRole('combobox', {
      name: 'Hva bruker du Arena til? (Velg gjerne flere)',
    });
    await userEvent.type(combobox, 'AEV');
    await clickOption('AEV');
    await clickOption('14a-vurdering');
    await clickOption('Tiltak');
    await clickOption('14a-vurdering', false);

    const inputField = screen.getByRole('textbox');
    fireEvent.change(inputField, {
      target: { value: 'Tester innsending Ja' },
    });

    const sendButton = screen.getByRole('button', {
      name: 'Send',
    });
    sendButton.click();

    const expectedFlexjarDTO: FlexjarFeedbackDTO = {
      feedbackId: 'Test',
      app: 'syfooversikt',
      svar: 'Ja',
      feedback: '[AEV, Tiltak]' + ' - ' + 'Tester innsending Ja',
    };
    const sendFeedbackMutation = queryClient.getMutationCache().getAll()[0];
    expect(sendFeedbackMutation?.state.variables).to.deep.equal(
      expectedFlexjarDTO
    );
  });

  it('sends feedback to flexjar when radio Nei', () => {
    renderFlexjar();

    const radio = screen.getByRole('radio', { name: 'Nei' });
    radio.click();

    const inputField = screen.getByRole('textbox');
    fireEvent.change(inputField, {
      target: { value: 'Tester innsending Nei' },
    });

    const sendButton = screen.getByRole('button', {
      name: 'Send',
    });
    sendButton.click();

    const expectedFlexjarDTO: FlexjarFeedbackDTO = {
      feedbackId: 'Test',
      app: 'syfooversikt',
      svar: 'Nei',
      feedback: 'Tester innsending Nei',
    };
    const sendFeedbackMutation = queryClient.getMutationCache().getAll()[0];
    expect(sendFeedbackMutation?.state.variables).to.deep.equal(
      expectedFlexjarDTO
    );
  });

  it('sets localstorage when sending feedback to flexjar', () => {
    renderFlexjar();
    const radio = screen.getByRole('radio', { name: 'Ja' });
    radio.click();

    const sendButton = screen.getByRole('button', {
      name: 'Send',
    });
    sendButton.click();

    expect(
      localStorage.getItem(StoreKey.FLEXJAR_ARENABRUK_FEEDBACK_DATE)
    ).to.not.equal('');
  });
});
