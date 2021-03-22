import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components';

interface NumberIndicatorProps {
  antall: number;
  valgtIndex: number;
}

const NumberIndicatorWrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;

  > * {
    margin: 0 0.25rem;
  }

  > :first-child {
    margin-left: 0;
  }

  > :last-child {
    margin-right: 0;
  }
`;

interface IndicatorProps {
  selected: boolean;
}

const StyledNumberIndicator = styled.div<IndicatorProps>`
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background-color: #99c2e8;
  ${(props: any) =>
    props.selected &&
    css`
      background-color: #0067c5;
      transition: background-color 333ms linear;
    `};
`;

export const NumberIndicator = ({
  antall,
  valgtIndex,
}: NumberIndicatorProps): ReactElement => {
  const mapTilSteg = () => {
    return new Array(antall)
      .fill(0)
      .map((_, i) => (
        <StyledNumberIndicator key={i} selected={i === valgtIndex} />
      ));
  };

  return <NumberIndicatorWrapper>{mapTilSteg()}</NumberIndicatorWrapper>;
};
