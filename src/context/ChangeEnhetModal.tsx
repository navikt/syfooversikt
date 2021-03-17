import React from 'react';
import ModalWrapper from 'nav-frontend-modal';
import { Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';

const texts = {
  beholdEnhet: 'Behold gammel enhet',
  byttEnhet: 'Bytt til ny enhet',
  header: 'Du har endret enhet',
  beskrivelse:
    'Du har allerede et vindu med Modia åpent. Hvis du fortsetter i dette vinduet vil du miste ulagret arbeid i det andre vinduet. Ønsker du å fortsette med dette vinduet?',
  beholdKnapp: 'Avbryt, jeg vil ikke miste ulagret arbeide',
  byttKnapp: 'Fortsett med ny enhet',
};

const ModalContent = styled.div`
  text-align: center;
  max-width: 34em;
  margin: auto;
`;

const ModalHeader = styled.h2`
  font-weight: 400;
`;

const ModalButtons = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled(Knapp)`
  margin: 1em auto auto;
`;

const Modal = styled(ModalWrapper)`
  min-width: 40em;
  padding: 1.5em;
`;

interface ChangeEnhetModalProps {
  isOpen: boolean;
  changeEnhet: () => void;
  keepEnhet: () => void;
}

const ChangeEnhetModal = ({
  isOpen,
  changeEnhet,
  keepEnhet,
}: ChangeEnhetModalProps) => {
  return (
    <Modal
      contentLabel="bytt enhet"
      isOpen={isOpen}
      onRequestClose={() => null}
      closeButton={false}
    >
      <ModalContent>
        <ModalHeader>{texts.header}</ModalHeader>
        <p>{texts.beskrivelse}</p>
        <hr />
        <ModalButtons>
          <Button
            autoFocus
            tabIndex={1}
            aria-label={texts.beholdEnhet}
            onClick={keepEnhet}
          >
            {texts.beholdKnapp}
          </Button>
          <Button
            className="lenke"
            tabIndex={2}
            aria-label={texts.byttEnhet}
            onClick={changeEnhet}
          >
            {texts.byttKnapp}
          </Button>
        </ModalButtons>
      </ModalContent>
    </Modal>
  );
};

export default ChangeEnhetModal;
