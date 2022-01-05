import React from 'react';
import { HendelseTypeFilter } from '@/components/HendelseTypeFilter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render } from '@testing-library/react';
import { expect } from 'chai';

describe('HendelseTypeFilter', () => {
  const queryClient = new QueryClient();

  it('Skal inneholde checkbokser med riktige labels', () => {
    const component = render(
      <QueryClientProvider client={queryClient}>
        <HendelseTypeFilter />
      </QueryClientProvider>
    );

    const onskerMoteCheckbox = component.getByRole('checkbox', {
      name: /Ønsker møte/,
      checked: false,
    });
    expect(onskerMoteCheckbox).to.exist;

    const svarMoteCheckbox = component.getByRole('checkbox', {
      name: /Svar møteplanlegger/,
      checked: false,
    });
    expect(svarMoteCheckbox).to.exist;

    const ufordelteCheckbox = component.getByRole('checkbox', {
      name: /Ufordelte brukere/,
      checked: false,
    });
    expect(ufordelteCheckbox).to.exist;

    const arbeidsgiverCheckbox = component.getByRole('checkbox', {
      name: /Arbeidsgiver ønsker bistand/,
      checked: false,
    });
    expect(arbeidsgiverCheckbox).to.exist;
  });
});
