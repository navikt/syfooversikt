import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { Loader } from '@navikt/ds-react';

const SpinnerContainer = styled.div`
  text-align: center;
  margin-top: 4rem;
`;

const AppSpinner = (): ReactElement => {
  return (
    <SpinnerContainer>
      <Loader size="2xlarge" title="Vent litt mens siden laster" />
    </SpinnerContainer>
  );
};

export default AppSpinner;
