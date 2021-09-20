import { EmptyDrawerImage } from '../../../img/ImageComponents';
import React from 'react';
import styled from 'styled-components';
import { Ingress } from 'nav-frontend-typografi';

export const texts = {
  ingenHendelser: 'Vi finner ingen personer som har hendelser',
  altText: 'Her var det ikke mye',
};

const Container = styled.div`
  margin-top: 4rem;
`;

const StyledDrawerComponent = styled.div`
  text-align: center;
`;

const IngressMarginTop = styled(Ingress)`
  margin-top: 2rem;
`;

export const EmptyDrawer = () => {
  return (
    <Container>
      <StyledDrawerComponent>
        <img alt={texts.altText} src={EmptyDrawerImage} />
        <IngressMarginTop>{texts.ingenHendelser}</IngressMarginTop>
      </StyledDrawerComponent>
    </Container>
  );
};
