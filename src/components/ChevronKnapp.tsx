import React from 'react';
import Chevron from 'nav-frontend-chevron';
import styled from 'styled-components';

const StyledChevronKnapp = styled.button`
    background: transparent;
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.25em;
    cursor: pointer;
    color: #0067c5
`;

const StyledChevronTekst = styled.span`
    color: #0067c5;
    box-sizing: border-box;
    margin-bottom: 2px;
    border: 2px solid transparent;
    ${StyledChevronKnapp}:hover & {
        border-bottom: 1px solid #0067c5;
    }
`;

const StyledChevron = styled(Chevron)`
`;

const StyledEmptyContainer = styled.div`
    padding: 0.5em;
`;

interface ChevronKnappProps {
    type?: 'høyre' | 'venstre';
    tekst: string;
    visible: boolean;
    onClick(): void;
}

const ChevronKnapp = ({ type = 'venstre', tekst, visible, onClick }: ChevronKnappProps) => {
    const Empty = <StyledEmptyContainer />;
    if (!visible) {
        return Empty;
    }
    const CustomLabel = <StyledChevronTekst>{tekst}</StyledChevronTekst>;

    return (
        <StyledChevronKnapp aria-label="blabla" onClick={onClick}>
            {type === 'høyre' && CustomLabel}
            <StyledChevron type={type} />
            {type === 'venstre' && CustomLabel}
        </StyledChevronKnapp>
    );
};

export default ChevronKnapp;
