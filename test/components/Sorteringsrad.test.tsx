import { expect } from 'chai';
import React from 'react';
import Sorteringsrad from '../../src/components/Sorteringsrad';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('Sorteringsrad', () => {
  it('Skal rendre navn, fodselsnummer, virksomhet og veileder', () => {
    render(<Sorteringsrad />, { wrapper: MemoryRouter });

    expect(screen.getByText('Etternavn')).to.exist;
    expect(screen.getByText(', Fornavn')).to.exist;
    expect(screen.getByText('Fødselsnummer')).to.exist;
    expect(screen.getByText('Virksomhet')).to.exist;
    expect(screen.getByText('Veileder')).to.exist;
  });
});
