import React, { ReactElement } from 'react';
import AlertStripe from 'nav-frontend-alertstriper';

export const AlertStripeRod = (
  melding: string,
  className?: string
): ReactElement => (
  <AlertStripe className={className} type="feil">
    {melding}
  </AlertStripe>
);
