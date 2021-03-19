import React, { ReactElement } from 'react';
import AlertStripe from 'nav-frontend-alertstriper';

export const AlertStripeWarning = (
  melding: string,
  className?: string
): ReactElement => (
  <AlertStripe className={className} type="advarsel">
    {melding}
  </AlertStripe>
);
