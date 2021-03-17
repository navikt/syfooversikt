import React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';

export const AlertStripeWarning = (melding: string, className?: string) => (
  <AlertStripe className={className} type="advarsel">
    {melding}
  </AlertStripe>
);
