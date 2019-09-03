import React, { useState, useEffect } from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import styled from 'styled-components';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import ChevronKnapp from '../ChevronKnapp';
import { Changelog } from '../../store/changelog/changelogTypes';
import NumberIndicator from '../NumberIndicator';

interface Props {
    isOpen: boolean;
    changelog?: Changelog;
    onClose(didComplete: boolean, version: number): void;
}

const StyledModal = styled(NavFrontendModal)`
    padding: 0 !important;
    .lukknapp {
        z-index: 3;
    }
`;

const StyledModalHeader = styled.div`
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: white;
    text-align: center;
    font-size: 30px;
    z-index: 2;
    font-weight: 400;
    box-shadow: 0 2px 5px rgba(120, 112, 106, 0.5);
`;

const StyledModalContent = styled.div`
    width: 500px;
    display: flex;
    flex-direction: column;
`;

const StyledModalMain = styled.section`
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
`;

const StyledModalButtons = styled.div`
    margin: 0.5em;
    margin-top: 1em;
    display: block;
    box-sizing: border-box;
    border: 2px solid transparent;

    > :nth-child(1) {
        float: left;
    }

    > :nth-child(3) {
        float: right;
    }

    > :nth-child(2) {
        position: absolute;
        left: 50%;
        bottom: 15px;
        transform: translate(-50%, -50%);
    }
`;

const StyledChangelogImage = styled.img`
    margin-bottom: 1em;
    width: 100%;
    height: 12.5rem;
    box-shadow: 0 2px 5px rgba(120, 112, 106, 0.5);
`;

const StyledChangelogTextField = styled.div`
    height: 4.125em;
    display: flex;
    align-items: center;
    justify-content: center;

    > p {
        overflow: hidden;
    }
`;

const ChangelogModal = ({ onClose, isOpen, changelog }: Props) => {
    if (!changelog) return <></>;

    const [ currentPageNumber, setPageNumber ] = useState(0);
    const [ currentPage, setCurrentPage ] = useState(changelog.items[currentPageNumber]);

    const isLastPage = (currentPageNumber === changelog.items.length - 1);
    const isFirstPage = currentPageNumber === 0;

    useEffect(() => {
        setCurrentPage(changelog.items[currentPageNumber]);
    }, [currentPageNumber]);

    return (
        <div>
            <StyledModal onRequestClose={() => {
                onClose(isLastPage, changelog.version);
            }} contentLabel="Changelog Modal" closeButton={true} isOpen={isOpen}>
                <StyledModalContent>
                    <StyledModalHeader>{changelog.title}</StyledModalHeader>
                    <StyledModalMain>
                        <StyledChangelogImage src={currentPage.image} />
                        <Undertittel>{currentPage.title}</Undertittel>
                        <StyledChangelogTextField>
                            <Normaltekst>{currentPage.text}</Normaltekst>
                        </StyledChangelogTextField>
                    </StyledModalMain>
                    <StyledModalButtons>
                        <ChevronKnapp type="venstre" tekst="Forrige" visible={!isFirstPage} onClick={() => {
                            setPageNumber(currentPageNumber - 1);
                        }}/>
                        <NumberIndicator antall={changelog.items.length} valgtIndex={currentPageNumber} />
                        {!isLastPage && <ChevronKnapp type="høyre" tekst="Neste" visible={true} onClick={() => {
                            setPageNumber(Math.min(currentPageNumber + 1, changelog.items.length - 1));
                        }}/>}
                        {isLastPage && <ChevronKnapp type="høyre" tekst="Ferdig" visible={true} onClick={() => {
                            onClose(isLastPage, changelog.version);
                        }}/>}
                    </StyledModalButtons>
                </StyledModalContent>
            </StyledModal>
        </div>
    );
};

export default ChangelogModal;
