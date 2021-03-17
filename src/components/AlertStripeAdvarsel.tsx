import React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';

export const AlertStripeRod = (melding: string, className?: string) => (
  <AlertStripe className={className} type="feil">
    {melding}
  </AlertStripe>
);
