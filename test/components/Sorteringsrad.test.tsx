import { expect } from 'chai';
import React from 'react';
import Sorteringsrad from '../../src/components/Sorteringsrad';
import { render, RenderResult } from '@testing-library/react';

let component: RenderResult;

describe('Sorteringsrad', () => {
  beforeEach(() => {
    component = render(<Sorteringsrad onSortClick={() => void 0} />);
  });

  it('Skal rendre navn, fodselsnummer, virksomhet og veileder', () => {
    expect(component.getByText('Etternavn')).to.exist;
    expect(component.getByText(', Fornavn')).to.exist;
    expect(component.getByText('Fødselsnummer')).to.exist;
    expect(component.getByText('Virksomhet')).to.exist;
    expect(component.getByText('Veileder')).to.exist;
  });
});
