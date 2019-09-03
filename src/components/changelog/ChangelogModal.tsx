import React, { useState, useEffect } from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import styled from 'styled-components';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import cn from 'classnames';
import ChevronKnapp from '../ChevronKnapp';
import { Changelog } from '../../store/changelog/changelogTypes';

interface Props {
    isOpen: boolean;
    changelog?: Changelog;
    onClose(didComplete: boolean, version: number): void;
}

interface NumberIndicatorProps {
    antall: number;
    valgtIndex: number;
}

const NumberIndicator = ({ antall, valgtIndex }: NumberIndicatorProps) => {
    const mapTilSteg = () => {
        return new Array(antall)
            .fill(0)
            .map((_, i) => (
                <div key={i} className={cn('step-indicator__step', {'step-indicator__step--selected': i === valgtIndex})}/>
            ));
    };

    return (
        <div className="step-indicator">
            {mapTilSteg()}
        </div>
    );
};

const StyledModal = styled(NavFrontendModal)`
    padding: 0 !important;
    .lukknapp {
        z-index: 3;
    }
`;

const ModalHeader = styled.div`
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: white;
    text-align: center;
    font-size: 30px;
    z-index: 2;
    font-weight: 400;
    box-shadow: 0 2px 5px rgba(120, 112, 106, 0.5);
`;

const ModalContent = styled.div`
    width: 500px;
    display: flex;
    flex-direction: column;
`;

const ModalMain = styled.section`
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
`;

const ModalButtons = styled.div`
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

const ChangelogImage = styled.img`
    margin-bottom: 1em;
    width: 100%;
    height: 12.5rem;
    box-shadow: 0 2px 5px rgba(120, 112, 106, 0.5);
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
                <ModalContent>
                    <ModalHeader>{changelog.title}</ModalHeader>
                    <ModalMain>
                        <ChangelogImage src={currentPage.image}
                        />
                        <Undertittel>{currentPage.title}</Undertittel>
                        <div style={{ height: '4.125em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Normaltekst style={{ overflow: 'hidden' }}>{currentPage.text}</Normaltekst>
                        </div>
                    </ModalMain>
                    <ModalButtons>
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
                    </ModalButtons>
                </ModalContent>
            </StyledModal>
        </div>
    );
};

export default ChangelogModal;
