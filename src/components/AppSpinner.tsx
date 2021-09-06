import React, { ReactElement } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import styled from 'styled-components';

const SpinnerContainer = styled.div`
  text-align: center;
  margin-top: 4rem;
`;

const AppSpinner = (): ReactElement => {
  return (
    <SpinnerContainer>
      <NavFrontendSpinner type="XL">
        Vent litt mens siden laster
      </NavFrontendSpinner>
    </SpinnerContainer>
  );
};

export default AppSpinner;
