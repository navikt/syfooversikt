import React from 'react';
import Personliste from '../../src/components/Personliste';
import { personregister } from '../data/fellesTestdata';
import { QueryClientProvider } from '@tanstack/react-query';
import { AktivEnhetProvider } from '@/context/aktivEnhet/AktivEnhetContext';
import { NotificationProvider } from '@/context/notification/NotificationContext';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import { testQueryClient } from '../testQueryClient';

const queryClient = testQueryClient();
const markertePersoner = ['123', '234'];

describe('Personliste', () => {
  it('Skal rendre 2 personrader', () => {
    render(
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          <AktivEnhetProvider>
            <Personliste
              personregister={personregister}
              checkboxHandler={() => void 0}
              markertePersoner={markertePersoner}
              startItem={0}
              endItem={1}
              sortingType={'FNR_DESC'}
            />
          </AktivEnhetProvider>
        </QueryClientProvider>
      </NotificationProvider>
    );

    expect(screen.getByRole('link', { name: 'Navn, Et' })).to.exist;
    expect(screen.getByRole('link', { name: 'Navn, Et Annet' })).to.exist;
  });
});
