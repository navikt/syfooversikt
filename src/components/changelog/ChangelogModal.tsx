import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalWrapper from 'nav-frontend-modal';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Changelog } from '@/api/types/changelogTypes';
import { NumberIndicator } from '../NumberIndicator';
import ChangelogChevronKnapp from './ChangelogChevronKnapp';

interface Props {
  isOpen: boolean;
  changelog: Changelog;

  onClose(didComplete: boolean, version: number): void;
}

const ModalStyled = styled(ModalWrapper)`
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
  font-size: 24px;
  z-index: 2;
  font-weight: 500;
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

const ChangelogTextField = styled.div`
  height: 4.125em;
  display: flex;
  padding-left: 1em;
  padding-right: 1em;
  align-items: center;
  justify-content: center;

  > p {
    overflow: hidden;
  }
`;

const ChangelogModal = ({
  onClose,
  isOpen,
  changelog,
}: Props): ReactElement => {
  const [currentPageNumber, setPageNumber] = useState(0);
  const [currentPage, setCurrentPage] = useState(
    changelog.items[currentPageNumber]
  );

  const isLastPage = currentPageNumber === changelog.items.length - 1;
  const isFirstPage = currentPageNumber === 0;

  useEffect(() => {
    setCurrentPage(changelog.items[currentPageNumber]);
  }, [changelog.items, currentPageNumber]);

  if (!currentPage) {
    return <></>;
  }

  return (
    <div>
      <ModalStyled
        onRequestClose={() => {
          onClose(isLastPage, changelog.version);
        }}
        contentLabel="Changelog Modal"
        closeButton={true}
        isOpen={isOpen}
      >
        <ModalContent>
          <ModalHeader>{changelog.title}</ModalHeader>
          <ModalMain>
            <ChangelogImage src={currentPage.image} />
            <Undertittel>{currentPage.title}</Undertittel>
            <ChangelogTextField>
              <Normaltekst>{currentPage.text}</Normaltekst>
            </ChangelogTextField>
          </ModalMain>
          <ModalButtons>
            <ChangelogChevronKnapp
              type="venstre"
              text="Forrige"
              visible={!isFirstPage}
              onClick={() => {
                setPageNumber(currentPageNumber - 1);
              }}
            />
            <NumberIndicator
              antall={changelog.items.length}
              valgtIndex={currentPageNumber}
            />
            {!isLastPage && (
              <ChangelogChevronKnapp
                type="høyre"
                text="Neste"
                visible={true}
                onClick={() => {
                  setPageNumber(
                    Math.min(currentPageNumber + 1, changelog.items.length - 1)
                  );
                }}
              />
            )}
            {isLastPage && (
              <ChangelogChevronKnapp
                type="høyre"
                text="Ferdig"
                visible={true}
                onClick={() => {
                  onClose(isLastPage, changelog.version);
                }}
              />
            )}
          </ModalButtons>
        </ModalContent>
      </ModalStyled>
    </div>
  );
};

export default ChangelogModal;
