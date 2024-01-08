import React, { ReactElement } from 'react';
import { Loader } from '@navikt/ds-react';

const AppSpinner = (): ReactElement => {
  return (
    <div className="text-center mt-16">
      <Loader size="2xlarge" title="Vent litt mens siden laster" />
    </div>
  );
};

export default AppSpinner;
