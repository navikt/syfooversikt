import React, { useEffect } from "react";
import { Button } from "@navikt/ds-react";
import { FeedbackNotification } from "@/sider/oversikt/sokeresultat/toolbar/Toolbar";

const text = {
  buttonLabel: "Tildel veileder",
  noPeopleSelectedErrorMessage:
    "Du må velge minst én person før du kan tildele veileder.",
};

interface Props {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  selectedPersoner: string[];
  setTableFeedbackNotification: (
    feedbackNotification: FeedbackNotification | undefined,
  ) => void;
}

/**
 * Button that opens the modal for assigning a veileder to the selected sykmeldte.
 * Shows an error notification if no sykmeldte are selected.
 */
export default function TildelVeilederButton({
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
        type: "error",
        text: text.noPeopleSelectedErrorMessage,
      });
    } else {
      modalRef.current?.showModal();
    }
  }

  return (
    <Button variant="secondary" size="small" onClick={onClick}>
      {text.buttonLabel}
    </Button>
  );
}
