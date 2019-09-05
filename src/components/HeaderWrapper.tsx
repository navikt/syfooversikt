import React from 'react';
import { PropsWithChildren } from 'react';
import { Container, Column } from 'nav-frontend-grid';
import styled from 'styled-components';

const ChildrenWrapper = styled.div`
    background: white;
    display: flex;
    flex-direction: column;
`;

const ContainerWrapper = styled.div`
    background: white;
    border-bottom: 1px solid #C6C2BF;
    margin-bottom: 2em;
`;

const HeaderWrapper = (props: PropsWithChildren<any>) => (
    <ContainerWrapper>
        <Container>
            <Column sm="12">
                <ChildrenWrapper>
                    {props.children}
                </ChildrenWrapper>
            </Column>
        </Container>
    </ContainerWrapper>
);

export default HeaderWrapper;
