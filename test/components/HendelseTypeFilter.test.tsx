import React from 'react';
import { HendelseTypeFilter } from '@/components/HendelseTypeFilter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';

const queryClient = new QueryClient();

describe('HendelseTypeFilter', () => {
  it('Skal inneholde checkbokser med riktige labels', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HendelseTypeFilter />
      </QueryClientProvider>
    );

    const onskerMoteCheckbox = screen.getByRole('checkbox', {
      name: /Ønsker møte/,
      checked: false,
    });
    expect(onskerMoteCheckbox).to.exist;

    const svarMoteCheckbox = screen.getByRole('checkbox', {
      name: /Svar møteplanlegger/,
      checked: false,
    });
    expect(svarMoteCheckbox).to.exist;

    const ufordelteCheckbox = screen.getByRole('checkbox', {
      name: /Ufordelte brukere/,
      checked: false,
    });
    expect(ufordelteCheckbox).to.exist;

    const arbeidsgiverCheckbox = screen.getByRole('checkbox', {
      name: /Arbeidsgiver ønsker bistand/,
      checked: false,
    });
    expect(arbeidsgiverCheckbox).to.exist;
  });
});
