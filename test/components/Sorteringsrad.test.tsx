import { describe, expect, it } from 'vitest';
import React from 'react';
import Sorteringsrad from '../../src/components/Sorteringsrad';
import { render, screen } from '@testing-library/react';

describe('Sorteringsrad', () => {
  it('Skal rendre navn, fodselsnummer, virksomhet og veileder', () => {
    render(<Sorteringsrad onSortClick={() => void 0} />);

    expect(screen.getByText('Etternavn')).to.exist;
    expect(screen.getByText(', Fornavn')).to.exist;
    expect(screen.getByText('Fødselsnummer')).to.exist;
    expect(screen.getByText('Virksomhet')).to.exist;
    expect(screen.getByText('Veileder')).to.exist;
  });
});
