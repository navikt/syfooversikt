import React, { ReactElement, useState } from "react";
import {
  useTildelVeileder,
  useVeiledereQuery,
} from "@/data/veiledereQueryHooks";
import { useGetPersonstatusQuery } from "@/data/personoversiktHooks";
import { VeilederArbeidstaker } from "@/api/types/veilederArbeidstakerTypes";
import {
  Button,
  Dialog,
  Label,
  List,
  LocalAlert,
  UNSAFE_Combobox,
} from "@navikt/ds-react";
import { PersonIcon } from "@navikt/aksel-icons";
import { FeedbackNotification } from "./Toolbar";

const texts = {
  openDialog: "Tildel veileder",
  header: "Tildel veileder",
  description1: "Her tildeler du innbyggeren til en veileder på din enhet.",
  description2: "Tildeling av enkelthendelser er ikke mulig.",
  alert: {
    title: "Gjelder kun Modia SYFO",
    description:
      "Tildelingen gjelder kun i Modia SYFO, ikke i Arena eller Modia Arbeidsrettet oppfølging",
  },
  selectedPersonsLabel: "Valgte personer",
  combobox: {
    label: "Velg veileder",
    placeholder: "Søk etter veileder",
    error: {
      missingVeileder: "Vennligst velg veileder",
    },
  },
  assignButton: "Tildel veileder",
  closeDialog: "Avbryt",
  missingSelectedPersons: "Vennligst velg personer før du tildeler veileder",
};

interface Props {
  selectedPersoner: string[];
  handleSelectAll: (checked: boolean) => void;
  setTableFeedbackNotification: (
    feedbackNotification: FeedbackNotification | undefined,
  ) => void;
}

export default function TildelVeileder({
  selectedPersoner,
  handleSelectAll,
  setTableFeedbackNotification,
}: Props): ReactElement {
  const veiledereQuery = useVeiledereQuery();
  const { data: personoversikt } = useGetPersonstatusQuery();
  const tildelVeileder = useTildelVeileder();

  const [selectedVeilederIdent, setSelectedVeilederIdent] = useState<
    string | undefined
  >();
  const [error, setError] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const veiledere = veiledereQuery.data || [];
  const personoversiktByFnr = new Map(
    personoversikt.map((person) => [person.fnr, person]),
  );

  const options = veiledere
    .filter((veileder) => veileder.enabled)
    .map((veileder) => {
      const fullName = `${veileder.etternavn}, ${veileder.fornavn}`;

      return {
        label: !fullName || fullName.trim() === "," ? veileder.ident : fullName,
        value: veileder.ident,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const onSelected = (option: string) => {
    setSelectedVeilederIdent(option);
    setError(undefined);
  };

  const selectedOptions = () => {
    const selectedOption = options.find(
      (option) => option.value === selectedVeilederIdent,
    );
    return selectedOption ? [selectedOption] : [];
  };

  const handleTildelVeileder = () => {
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
      setOpen(false);
    } else {
      setError(texts.combobox.error.missingVeileder);
    }
  };

  const openDialog = () => {
    if (selectedPersoner.length === 0) {
      setTableFeedbackNotification({
        type: "warning",
        text: texts.missingSelectedPersons,
      });
      return;
    }
    setOpen(true);
  };

  const resetStateToDefault = () => {
    setSelectedVeilederIdent(undefined);
    setError(undefined);
  };

  return (
    <div tabIndex={1}>
      <Button size="small" onClick={openDialog}>
        {texts.openDialog}
      </Button>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          resetStateToDefault();
        }}
      >
        <Dialog.Popup>
          <Dialog.Header>
            <Dialog.Title>{texts.header}</Dialog.Title>
            <Dialog.Description>{texts.description1}</Dialog.Description>
            <Dialog.Description>{texts.description2}</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body className="flex flex-col gap-4">
            <LocalAlert status="warning" size="small">
              <LocalAlert.Header>
                <LocalAlert.Title>{texts.alert.title}</LocalAlert.Title>
              </LocalAlert.Header>
              <LocalAlert.Content>{texts.alert.description}</LocalAlert.Content>
            </LocalAlert>
            <div>
              <Label>{texts.selectedPersonsLabel}</Label>
              <List size="small">
                {selectedPersoner.map((fnr) => {
                  const person = personoversiktByFnr.get(fnr);
                  return (
                    <List.Item key={fnr} icon={<PersonIcon />}>
                      {person ? `${person.navn} (${fnr})` : fnr}
                    </List.Item>
                  );
                })}
              </List>
            </div>
            <UNSAFE_Combobox
              shouldAutocomplete
              label={texts.combobox.label}
              placeholder={texts.combobox.placeholder}
              options={options}
              selectedOptions={selectedOptions()}
              onToggleSelected={onSelected}
              error={error}
            />
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger>
              <Button variant="secondary">{texts.closeDialog}</Button>
            </Dialog.CloseTrigger>
            <Button onClick={handleTildelVeileder}>{texts.assignButton}</Button>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog>
    </div>
  );
}
