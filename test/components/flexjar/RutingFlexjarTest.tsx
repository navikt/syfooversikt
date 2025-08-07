import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defaultErrorTexts } from '@/api/errors';
import { FlexjarFeedbackDTO } from '@/data/flexjar/useFlexjarFeedback';
import { StoreKey } from '@/hooks/useLocalStorageState';
import { aktivEnhetMock } from '@/mocks/data/aktivEnhetMock';
import { AktivEnhetContext } from '@/context/aktivEnhet/AktivEnhetContext';
import { testQueryClient } from '../../testQueryClient';
import { veiledereQueryKeys } from '@/data/veiledereQueryHooks';
import { veilederMock } from '@/mocks/syfoveileder/veilederMock';
import { stubFlexjarApiError, stubFlexjarApiOk } from '../../stubs/stubFlexjar';
import RutingFlexjar from '@/components/flexjar/RutingFlexjar';

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
        <RutingFlexjar side={'Test'} />
      </AktivEnhetContext.Provider>
    </QueryClientProvider>
  );

describe('Flexjar ruting', () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    queryClient.setQueryData(
      veiledereQueryKeys.veiledereInfo,
      () => veilederMock
    );
  });
  afterEach(() => {
    localStorage.setItem(StoreKey.FLEXJAR_RUTING_FEEDBACK_DATE, '');
  });

  it('renders open flexjar and feedback button', () => {
    renderFlexjar();
    expect(
      screen.getByRole('button', {
        name: 'Flytter du sykmeldte mellom enheter?',
      })
    ).to.exist;
    expect(
      screen.getByText('Bruker du Arena til å flytte sykmeldte mellom enheter?')
    ).to.exist;
  });

  it('renders feedback form content after radiobutton click Ja', () => {
    renderFlexjar();
    const radio = screen.getByRole('radio', { name: 'Ja' });
    fireEvent.click(radio);

    expect(screen.getByText('Hva er årsaken til/bakgrunnen for flyttingen?')).to
      .exist;
    expect(
      screen.getByText('Ikke skriv inn navn eller andre personopplysninger.')
    ).to.exist;
    expect(screen.getByRole('textbox')).to.exist;
    expect(screen.getByRole('button', { name: 'Send' })).to.exist;
  });

  it('renders send button after radiobutton click Nei', () => {
    renderFlexjar();
    const radio = screen.getByRole('radio', { name: 'Nei' });
    fireEvent.click(radio);

    expect(screen.getByRole('button', { name: 'Send' })).to.exist;
  });

  it('sends tilbakemelding when radio selected', async () => {
    renderFlexjar();
    stubFlexjarApiOk();

    const radio = screen.getByRole('radio', { name: 'Ja' });
    fireEvent.click(radio);

    const sendButton = screen.getByRole('button', {
      name: 'Send',
    });
    fireEvent.click(sendButton);

    expect(await screen.findByRole('img', { name: 'Suksess' })).to.exist;
    expect(await screen.findByText('Takk for din tilbakemelding!')).to.exist;
  });

  it('does not send tilbakemelding when error', async () => {
    renderFlexjar();
    stubFlexjarApiError();

    const radio = screen.getByRole('radio', { name: 'Ja' });
    fireEvent.click(radio);

    const sendButton = screen.getByRole('button', {
      name: 'Send',
    });
    fireEvent.click(sendButton);

    expect(await screen.findByRole('img', { name: 'Feil' })).to.exist;
    expect(await screen.findByText(defaultErrorTexts.generalError)).to.exist;
    expect(screen.queryByText('Takk for din tilbakemelding!')).to.not.exist;
  });

  it('sends feedback to flexjar when radio Ja with options', async () => {
    renderFlexjar();

    const radio = screen.getByRole('radio', { name: 'Ja' });
    fireEvent.click(radio);

    const inputField = screen.getByRole('textbox');
    fireEvent.change(inputField, {
      target: { value: 'Tester innsending Ja' },
    });

    const sendButton = screen.getByRole('button', {
      name: 'Send',
    });
    fireEvent.click(sendButton);

    const expectedFlexjarDTO: FlexjarFeedbackDTO = {
      feedbackId: 'Test - Ruting',
      app: 'syfooversikt',
      svar: 'Ja',
      feedback: 'Tester innsending Ja',
    };
    const sendFeedbackMutation = queryClient.getMutationCache().getAll()[0];
    expect(sendFeedbackMutation?.state.variables).to.deep.equal(
      expectedFlexjarDTO
    );
  });

  it('sends feedback to flexjar when radio Nei', () => {
    renderFlexjar();

    const radio = screen.getByRole('radio', { name: 'Nei' });
    fireEvent.click(radio);

    const sendButton = screen.getByRole('button', {
      name: 'Send',
    });
    fireEvent.click(sendButton);

    const expectedFlexjarDTO: FlexjarFeedbackDTO = {
      feedbackId: 'Test - Ruting',
      app: 'syfooversikt',
      svar: 'Nei',
      feedback: undefined,
    };
    const sendFeedbackMutation = queryClient.getMutationCache().getAll()[0];
    expect(sendFeedbackMutation?.state.variables).to.deep.equal(
      expectedFlexjarDTO
    );
  });

  it('sets localstorage when sending feedback to flexjar', () => {
    renderFlexjar();
    const radio = screen.getByRole('radio', { name: 'Ja' });
    fireEvent.click(radio);

    const sendButton = screen.getByRole('button', {
      name: 'Send',
    });
    fireEvent.click(sendButton);

    expect(
      localStorage.getItem(StoreKey.FLEXJAR_RUTING_FEEDBACK_DATE)
    ).to.not.equal('');
  });
});
