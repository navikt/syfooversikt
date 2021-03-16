import React, { ReactElement } from 'react';
import styled from 'styled-components';

const Tekst = styled.div`
  font-size: 1em;
  font-weight: 600;
  margin-bottom: 0.5em;
`;

export const FilterTitle = (
  props: React.PropsWithChildren<unknown>
): ReactElement => <Tekst>{props.children}</Tekst>;
