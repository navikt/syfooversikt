import React from 'react';
import Personliste from '../../src/components/Personliste';
import { personregister } from '../data/fellesTestdata';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { render } from '@testing-library/react';
import { expect } from 'chai';

describe('Personliste', () => {
  const queryClient = new QueryClient();
  const markertePersoner = ['123', '234'];
  const checkboxHandler = () => void 0;

  it('Skal rendre 2 personrader', () => {
    const component = render(
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          <AktivEnhetProvider>
            <Personliste
              personregister={personregister}
              checkboxHandler={checkboxHandler}
              markertePersoner={markertePersoner}
              startItem={0}
              endItem={1}
              sortingType={'FNR_DESC'}
            />
          </AktivEnhetProvider>
        </QueryClientProvider>
      </NotificationProvider>
    );

    expect(component.getByRole('link', { name: 'Et Navn' })).to.exist;
    expect(component.getByRole('link', { name: 'Et Annet Navn' })).to.exist;
  });
});
