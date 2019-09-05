import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const tekster = {
    enhetensOversikt: 'Enhetens oversikt',
    minOversikt: 'Min oversikt',
};

const LinkStyled = styled(NavLink)`
    padding: 0;
    background-color: transparent;
    border: none;
    font-weight: 600;
    font-size: 20px;
    cursor: pointer;
    color: black;
    border-bottom: 0.1em transparent solid;
    border-bottom-color: transparent;
    text-decoration: none;

    &.active {
        border-bottom-color: #0C5EA8
    }

    &:visited {
        color: black;
    }

    &:focus {
        outline: none;
    }

    &:hover {
        border-bottom-color: #0C5EA8;
    }

`;

const NavigationBar = styled.div`
    margin-bottom:  1em;
    display: flex;

    >:not(:last-child) {
        margin-right: 1em;
    }
`;

export default () => (
    <NavigationBar>
        <LinkStyled activeClassName="active" to={'/enhet'}>{tekster.enhetensOversikt}</LinkStyled>
        <LinkStyled activeClassName="active" to={'/minoversikt'}>{tekster.minOversikt}</LinkStyled>
    </NavigationBar>
);
