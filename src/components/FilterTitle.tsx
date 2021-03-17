import React from 'react';
import styled from 'styled-components';

const Tekst = styled.div`
  font-size: 1em;
  font-weight: 600;
  margin-bottom: 0.5em;
`;

export default (props: React.PropsWithChildren<any>) => (
  <Tekst>{props.children}</Tekst>
);
