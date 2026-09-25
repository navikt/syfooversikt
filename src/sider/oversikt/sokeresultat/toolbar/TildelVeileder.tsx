import React, { ReactElement, useState } from "react";
import {
  useTildelVeileder,
  useVeiledereQuery,
} from "@/data/veiledereQueryHooks";
import { VeilederArbeidstaker } from "@/api/types/veilederArbeidstakerTypes";
import { Alert, Button, Dialog, UNSAFE_Combobox } from "@navikt/ds-react";

const texts = {
  openDialog: "Tildel veileder",
  header: "Tildel veileder",
  description1: "Her tildeler du innbyggeren til en veileder på din enhet.",
  description2: "Tildeling av enkelthendelser er ikke mulig.",
  alert:
    "Tildelingen gjelder kun i Modia SYFO, ikke i Arena eller Modia Arbeidsrettet oppfølging",
  combobox: {
    label: "Velg veileder",
    placeholder: "Søk etter veileder",
  },
  assignButton: "Tildel",
  closeDialog: "Avbryt",
};

interface Props {
  selectedPersoner: string[];
  handleSelectAll: (checked: boolean) => void;
}

export default function TildelVeileder({
  selectedPersoner,
  handleSelectAll,
}: Props): ReactElement {
  const veiledereQuery = useVeiledereQuery();
  const tildelVeileder = useTildelVeileder();

  const [selectedVeilederIdent, setSelectedVeilederIdent] = useState<
    string | undefined
  >();
  const [isError, setIsError] = useState(false);

  const veiledere = veiledereQuery.data || [];

  const resetStateToDefault = () => {
    setSelectedVeilederIdent(undefined);
    setIsError(false);
  };

  const options = veiledere
    .map((veileder) => {
      const fullName = `${veileder.etternavn}, ${veileder.fornavn}`;

      return {
        label: !fullName || fullName.trim() === "," ? veileder.ident : fullName,
        value: veileder.ident,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const onSelected = (option: string) => {
    console.log("click", option);
    setSelectedVeilederIdent(option);
    setIsError(false);
  };

  const selectedOptions = () => {
    const selectedOption = options.find(
      (option) => option.value === selectedVeilederIdent,
    );
    return selectedOption ? [selectedOption] : [];
  };

  const handleTildelVeileder = () => {
    console.log("selectedVeilederIdent", selectedVeilederIdent);
    if (selectedVeilederIdent !== undefined) {
      const tildeltePersoner = selectedPersoner.map(
        (fnr: string): VeilederArbeidstaker => ({
          veilederIdent: selectedVeilederIdent,
          fnr,
        }),
      );
      tildelVeileder.mutate(tildeltePersoner, {
        onSuccess: () => handleSelectAll(false),
      });
    } else {
      setIsError(true);
    }
  };

  return (
    <div tabIndex={1}>
      <Dialog>
        <Dialog.Trigger>
          <Button size="small" disabled={selectedPersoner.length === 0}>
            {texts.openDialog}
          </Button>
        </Dialog.Trigger>
        <Dialog.Popup>
          <Dialog.Header>
            <Dialog.Title>{texts.header}</Dialog.Title>
            <Dialog.Description>{texts.description1}</Dialog.Description>
            <Dialog.Description>{texts.description2}</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <Alert className="mb-4" variant="warning" size="small">
              {texts.alert}
            </Alert>
            <UNSAFE_Combobox
              shouldAutocomplete
              label={texts.combobox.label}
              placeholder={texts.combobox.placeholder}
              options={options}
              selectedOptions={selectedOptions()}
              onToggleSelected={onSelected}
            />
          </Dialog.Body>
          <Dialog.Footer>
            <Button onClick={handleTildelVeileder}>{texts.assignButton}</Button>
            <Dialog.CloseTrigger>
              <Button variant="secondary" onClick={resetStateToDefault}>
                {texts.closeDialog}
              </Button>
            </Dialog.CloseTrigger>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog>
    </div>
  );
}
