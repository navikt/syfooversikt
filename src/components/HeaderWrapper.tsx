import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { Column, Container } from 'nav-frontend-grid';

const ChildrenWrapper = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
`;

const ContainerWrapper = styled.div`
  background: white;
  border-bottom: 1px solid #c6c2bf;
  margin-bottom: 2em;
`;

const HeaderWrapper = (props: PropsWithChildren<any>) => (
  <ContainerWrapper>
    <Container>
      <Column sm="12">
        <ChildrenWrapper>{props.children}</ChildrenWrapper>
      </Column>
    </Container>
  </ContainerWrapper>
);

export default HeaderWrapper;
