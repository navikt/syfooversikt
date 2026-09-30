import React, { useState } from "react";
import { BodyShort, Button, Modal, UNSAFE_Combobox } from "@navikt/ds-react";
import { VeilederDTO } from "@/api/types/veiledereTypes";
import { VeilederArbeidstaker } from "@/api/types/veilederArbeidstakerTypes";
import {
  useAktivVeilederQuery,
  useTildelVeileder,
  useVeiledereQuery,
} from "@/data/veiledereQueryHooks";
import {
  getVeilederLabelWithIdent,
  sortVeiledereBySurnameAsc,
} from "@/utils/veiledereUtils";
import ValgtePersonerList from "@/sider/oversikt/sokeresultat/toolbar/ValgtePersonerList";

const text = {
  heading: "Tildel veileder",
  velgVeileder: "Velg veileder",
  formErrorMessage: "Du må velge en veileder for å kunne tildele.",
  tildel: "Tildel veileder",
  avbryt: "Avbryt",
};

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
  selectedPersoner: string[];
  setSelectedPersoner: (personer: string[]) => void;
}

function toComboboxOption(veileder: VeilederDTO) {
  return {
    label: getVeilederLabelWithIdent(veileder),
    value: veileder.ident,
  };
}

/**
 * Modal for choosing a veileder and assigning the selected sykmeldte to them.
 */
export default function TildelVeilederModal({
  ref,
  selectedPersoner,
  setSelectedPersoner,
}: Props) {
  const veiledereQuery = useVeiledereQuery();
  const aktivVeilederQuery = useAktivVeilederQuery();
  const tildelVeileder = useTildelVeileder();
  const [chosenVeilederIdent, setChosenVeilederIdent] = useState("");
  const [isFormError, setIsFormError] = useState(false);

  const enabledVeiledere =
    veiledereQuery.data?.filter((veileder) => veileder.enabled) || [];
  const options = sortVeiledereBySurnameAsc(
    enabledVeiledere,
    aktivVeilederQuery.data?.ident || "",
  ).map(toComboboxOption);
  const selectedOptions = options.filter(
    (option) => option.value === chosenVeilederIdent,
  );

  function closeModal() {
    if (ref.current?.open) {
      ref.current.close();
    }
  }

  function resetState() {
    setChosenVeilederIdent("");
    setIsFormError(false);
  }

  function onToggleSelected(ident: string, isSelected: boolean) {
    setChosenVeilederIdent(isSelected ? ident : "");
    setIsFormError(!isSelected);
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (chosenVeilederIdent === "") {
      setIsFormError(true);
      return;
    }
    const tilknytninger: VeilederArbeidstaker[] = selectedPersoner.map(
      (fnr) => ({ veilederIdent: chosenVeilederIdent, fnr }),
    );
    tildelVeileder.mutate(tilknytninger);
    setSelectedPersoner([]);
    closeModal();
  }

  return (
    <Modal ref={ref} header={{ heading: text.heading }} onClose={resetState}>
      <Modal.Body className="flex min-h-[24rem] flex-col gap-4">
        <form id="tildel-veileder-form" onSubmit={onSubmit}>
          <UNSAFE_Combobox
            label={text.velgVeileder}
            size="small"
            options={options}
            selectedOptions={selectedOptions}
            onToggleSelected={onToggleSelected}
            error={isFormError && text.formErrorMessage}
          />
        </form>
        <div>
          <BodyShort>Du tildeler nå følgende personer:</BodyShort>
          <ValgtePersonerList selectedPersoner={selectedPersoner} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button form="tildel-veileder-form" type="submit">
          {text.tildel}
        </Button>
        <Button type="button" variant="secondary" onClick={closeModal}>
          {text.avbryt}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
