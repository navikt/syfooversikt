import React from 'react';
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

const NumberIndicator = styled.div<IndicatorProps>`
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background-color: #99C2E8;
    ${(props: any) => props.selected && css`
        background-color: #0067C5;
        transition: background-color 333ms linear;
    `};
`;

export default ({ antall, valgtIndex }: NumberIndicatorProps) => {
    const mapTilSteg = () => {
        return new Array(antall)
            .fill(0)
            .map((_, i) => (
                <NumberIndicator key={i} selected={i === valgtIndex} />
            ));
    };

    return (
        <NumberIndicatorWrapper>
            {mapTilSteg()}
        </NumberIndicatorWrapper>
    );
};
