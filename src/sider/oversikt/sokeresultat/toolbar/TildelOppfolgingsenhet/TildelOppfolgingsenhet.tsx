import {
  Alert,
  Button,
  List,
  UNSAFE_Combobox,
  Dialog,
  Label,
  LocalAlert,
} from "@navikt/ds-react";
import React, { useState } from "react";
import { useGetMuligeOppfolgingsenheter } from "@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/hooks/useGetMuligeOppfolgingsenheter";
import {
  OppfolgingsenhetTildelingerResponseDTO,
  usePostTildelOppfolgingsenhet,
} from "@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/hooks/usePostTildelOppfolgingsenhet";
import { useGetPersonstatusQuery } from "@/data/personoversiktHooks";
import { FeedbackNotification } from "@/sider/oversikt/sokeresultat/toolbar/Toolbar";
import { PersonIcon } from "@navikt/aksel-icons";

const text = {
  buttonLabelTildelOppfolgingsenhet: "Tildel oppfølgingenhet",
  heading: "Tildel oppfølgingsenhet",
  description:
    "Her kan du flytte den sykmeldte til en annen oppfølgingsenhet. Dersom den sykemeldte har endret bostedsadresse, skjer flyttingen automatisk.",
  velgOppfolgingsenhet: "Velg ny oppfølgingsenhet",
  formErrorMessage: "Du må velge en oppfølgingsenhet",
  getMuligeOppfolgingsenheterFailedErrorMessage: {
    title: "Noe gikk galt",
    description: "Klarte ikke å hente enheter.",
  },
  selectedPersonsLabel: "Valgte personer",
  buttonLabel: "Tildel oppfølgingsenhet",
  endreEnhet: "Tildel oppfølgingsenhet",
  avbryt: "Avbryt",
  errorMessage: "Tildeling av oppfølgingsenhet feilet.",
  missingSelectedPersons:
    "Vennligst velg personer før du tildeler oppfølgingsenhet",
};

const tildelOppfolgingsenhetSuccessText = (
  antallTildelt: number,
  antallMaybeTildelt: number,
  enhet: string,
): string => {
  if (antallMaybeTildelt > 1) {
    return `${antallTildelt} av ${antallMaybeTildelt} personer tildelt ${enhet}.`;
  } else {
    return `En person tildelt ${enhet}.`;
  }
};

interface Props {
  selectedPersoner: string[];
  setSelectedPersoner: (personer: string[]) => void;
  setTableFeedbackNotification: (
    feedbackNotification: FeedbackNotification | undefined,
  ) => void;
}

export default function TildelOppfolgingsenhet({
  selectedPersoner,
  setSelectedPersoner,
  setTableFeedbackNotification,
}: Props) {
  const getMuligeOppfolgingsenheter = useGetMuligeOppfolgingsenheter();
  const postTildelOppfolgingsenhet = usePostTildelOppfolgingsenhet();
  const { data: personoversikt } = useGetPersonstatusQuery();

  const [open, setOpen] = useState(false);
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const [oppfolgingsenhet, setOppfolgingsenhet] = useState<
    string | undefined
  >();

  const selectedPersonerInfo = personoversikt.filter((person) =>
    selectedPersoner.includes(person.fnr),
  );

  const onOppfolgingsenhetChange = (option: string, isSelected: boolean) => {
    if (isSelected) {
      setIsFormError(false);
      setOppfolgingsenhet(option);
    } else {
      setIsFormError(true);
      setOppfolgingsenhet(undefined);
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const isFormValid = oppfolgingsenhet !== undefined;
    if (!isFormValid) {
      setIsFormError(true);
    } else {
      postTildelOppfolgingsenhet.mutate(
        {
          personidenter: selectedPersoner,
          oppfolgingsenhet: oppfolgingsenhet,
        },
        {
          onSuccess: (response: OppfolgingsenhetTildelingerResponseDTO) => {
            const tildeltOppfolgingsenhet =
              getMuligeOppfolgingsenheter.data?.find(
                (enhet) => enhet.enhetId === oppfolgingsenhet,
              );
            const antallTildelt = response.tildelinger.length;
            const antallMaybeTildelt = selectedPersoner.length;
            setTableFeedbackNotification({
              type: "success",
              text: tildelOppfolgingsenhetSuccessText(
                antallTildelt,
                antallMaybeTildelt,
                `${tildeltOppfolgingsenhet?.navn} (${tildeltOppfolgingsenhet?.enhetId})`,
              ),
            });
            setSelectedPersoner([]);
          },
          onSettled: () => {
            setOpen(false);
            resetStateToDefault();
          },
        },
      );
    }
  };

  const openDialog = () => {
    if (selectedPersoner.length === 0) {
      setTableFeedbackNotification({
        type: "warning",
        text: text.missingSelectedPersons,
      });
      return;
    }
    setOpen(true);
  };

  const resetStateToDefault = () => {
    setOppfolgingsenhet(undefined);
    setIsFormError(false);
  };

  return (
    <>
      <Button size="small" variant="secondary" onClick={openDialog}>
        {text.buttonLabelTildelOppfolgingsenhet}
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
            <Dialog.Title>{text.heading}</Dialog.Title>
            <Dialog.Description>{text.description}</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body className="flex flex-col gap-4">
            {getMuligeOppfolgingsenheter.isError && (
              <LocalAlert status="error">
                <LocalAlert.Header>
                  <LocalAlert.Title>
                    {text.getMuligeOppfolgingsenheterFailedErrorMessage.title}
                  </LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                  {
                    text.getMuligeOppfolgingsenheterFailedErrorMessage
                      .description
                  }
                </LocalAlert.Content>
              </LocalAlert>
            )}
            <div>
              <Label>{text.selectedPersonsLabel}</Label>
              <List size="small">
                {selectedPersonerInfo.map((person, index) => {
                  const virksomhetList =
                    person.latestOppfolgingstilfelle?.virksomhetList;
                  const virksomhetText = virksomhetList
                    ?.map((v) => v.virksomhetsnavn)
                    .join(", ");
                  return (
                    <List.Item key={index} icon={<PersonIcon />}>
                      {`${person.navn} (${person.fnr}). `}
                      {!!virksomhetList?.length
                        ? `Virksomhet: `
                        : "Uten virksomhet"}
                      <b>{virksomhetText}</b>
                    </List.Item>
                  );
                })}
              </List>
            </div>
            {getMuligeOppfolgingsenheter.isSuccess && (
              <form id="form" onSubmit={onSubmit}>
                <UNSAFE_Combobox
                  label={text.velgOppfolgingsenhet}
                  options={getMuligeOppfolgingsenheter.data.map((enhet) => ({
                    label: `${enhet.navn} - ${enhet.enhetId}`,
                    value: enhet.enhetId,
                  }))}
                  onToggleSelected={onOppfolgingsenhetChange}
                  error={isFormError && text.formErrorMessage}
                />
              </form>
            )}
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger>
              <Button variant="secondary">{text.avbryt}</Button>
            </Dialog.CloseTrigger>
            {getMuligeOppfolgingsenheter.isSuccess && (
              <Button
                form="form"
                loading={postTildelOppfolgingsenhet.isPending}
              >
                {text.endreEnhet}
              </Button>
            )}
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog>
    </>
  );
}
