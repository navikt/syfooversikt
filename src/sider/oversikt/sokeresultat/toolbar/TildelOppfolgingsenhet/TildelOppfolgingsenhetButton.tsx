import React, { useEffect } from 'react';
import { Button } from '@navikt/ds-react';
import { FeedbackNotification } from '@/sider/oversikt/sokeresultat/toolbar/Toolbar';

const text = {
  buttonLabelTildelOppfolgingsenhet: 'Tildel oppfølgingenhet',
  noPeopleSelectedErrorMessage:
    'Du må velge minst én person før du kan tildele oppfølgingsenhet.',
};

interface Props {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  selectedPersoner: string[];
  setTableFeedbackNotification: (
    feedbackNotification: FeedbackNotification | undefined
  ) => void;
}

export default function TildelOppfolgingsenhetButton({
  modalRef,
  selectedPersoner,
  setTableFeedbackNotification,
}: Props) {
  useEffect(() => {
    if (selectedPersoner.length > 0) {
      setTableFeedbackNotification(undefined);
    }
  }, [selectedPersoner, setTableFeedbackNotification]);

  function onClick() {
    const isNoPersonsSelected = selectedPersoner.length === 0;
    if (isNoPersonsSelected) {
      setTableFeedbackNotification({
        type: 'error',
        text: text.noPeopleSelectedErrorMessage,
      });
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
