import React, { ReactElement } from 'react';
import Side from './Side';
import { Container } from 'nav-frontend-grid';

//todo wut
export const ManglerTilgangsside = (): ReactElement => (
  <Side tittel="Under utvikling">
    <Container>
      <h1>Under utvikling</h1>
      <p>Denne tjenesten er utilgjengelig for øyeblikket.</p>
    </Container>
  </Side>
);
