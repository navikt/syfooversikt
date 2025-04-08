import React, { useEffect } from 'react';
import { Button } from '@navikt/ds-react';

const text = {
  buttonLabelTildelOppfolgingsenhet: 'Tildel oppfølgingenhet',
  noPeopleSelectedErrorMessage:
    'Du må velge minst én person før du kan tildele oppfølgingsenhet.',
};

interface Props {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  selectedPersoner: string[];
  setTableActionError: (error: string) => void;
}

export default function TildelOppfolgingsenhetButton({
  modalRef,
  selectedPersoner,
  setTableActionError,
}: Props) {
  const [isClicked, setIsClicked] = React.useState(false);
  useEffect(() => {
    if (isClicked && selectedPersoner.length > 0) {
      setTableActionError('');
    }
  }, [isClicked, selectedPersoner, setTableActionError]);

  function onClick() {
    setIsClicked(true);
    const isNoPersonsSelected = selectedPersoner.length === 0;
    if (isNoPersonsSelected) {
      setTableActionError(text.noPeopleSelectedErrorMessage);
    } else {
      modalRef.current?.showModal();
    }
  }

  return (
    <Button variant="secondary" size="small" onClick={onClick}>
      {text.buttonLabelTildelOppfolgingsenhet}
    </Button>
  );
}
