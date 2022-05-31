import React, { lazy, ReactElement } from 'react';
import Side from './Side';
import { Container } from 'nav-frontend-grid';

const AppExposed = lazy(() => import('app2/AppExposed'));

//todo wut
export const ManglerTilgangsside = (): ReactElement => (
  <Side tittel="Under utvikling">
    <Container>
      <h1>Under utvikling</h1>
      <p>Denne tjenesten er utilgjengelig for øyeblikket.</p>

      <h2>Exposed App</h2>
      <React.Suspense fallback="loading...">
        <AppExposed />
      </React.Suspense>
    </Container>
  </Side>
);
