import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  List,
  Modal,
  Skeleton,
  UNSAFE_Combobox,
  Box,
  Dialog,
} from "@navikt/ds-react";
import React, { useState } from "react";
import { useGetMuligeOppfolgingsenheter } from "@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/hooks/useGetMuligeOppfolgingsenheter";
import {
  OppfolgingsenhetTildelingerResponseDTO,
  usePostTildelOppfolgingsenhet,
} from "@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/hooks/usePostTildelOppfolgingsenhet";
import { useGetPersonstatusQuery } from "@/data/personoversiktHooks";
import { FeedbackNotification } from "@/sider/oversikt/sokeresultat/toolbar/Toolbar";

const text = {
  buttonLabelTildelOppfolgingsenhet: "Tildel oppfølgingenhet",
  heading: "Endre oppfølgingsenhet",
  description:
    "Her kan du flytte den sykmeldte til en annen oppfølgingsenhet. Dersom den sykemeldte har endret bostedsadresse, skjer flyttingen automatisk.",
  velgOppfolgingsenhet: "Velg ny oppfølgingsenhet",
  formErrorMessage: "Du må velge en oppfølgingsenhet",
  getMuligeOppfolgingsenheterFailedErrorMessage:
    "Noe gikk galt. Klarer ikke å hente mulig enheter å tildele til.",
  buttonLabel: "Tildel oppfølgingsenhet",
  endreEnhet: "Endre oppfølgingsenhet",
  avbryt: "Avbryt",
  errorMessage: "Tildeling av oppfølgingsenhet feilet.",
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
  ref: React.RefObject<HTMLDialogElement | null>;
  selectedPersoner: string[];
  setSelectedPersoner: (personer: string[]) => void;
  setTableFeedbackNotification: (
    feedbackNotification: FeedbackNotification | undefined,
  ) => void;
}

export default function TildelOppfolgingsenhet({
  ref,
  selectedPersoner,
  setSelectedPersoner,
  setTableFeedbackNotification,
}: Props) {
  const getMuligeOppfolgingsenheter = useGetMuligeOppfolgingsenheter();
  const postTildelOppfolgingsenhet = usePostTildelOppfolgingsenhet();
  const [oppfolgingsenhet, setOppfolgingsenhet] = useState<string>("");
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const showTildelingerInfo = !!oppfolgingsenhet;
  const chosenOppfolgingsenhet = getMuligeOppfolgingsenheter?.data?.find(
    (enhet) => enhet.enhetId === oppfolgingsenhet,
  );
  const { data: personoversikt } = useGetPersonstatusQuery();
  const selectedPersonerInfo = personoversikt.filter((person) =>
    selectedPersoner.includes(person.fnr),
  );

  function closeModal() {
    if (ref.current?.open) {
      ref.current.close();
    }
  }

  function onOppfolgingsenhetChange(option: string, isSelected: boolean) {
    if (isSelected) {
      setIsFormError(false);
      setOppfolgingsenhet(option);
    } else {
      setIsFormError(true);
      setOppfolgingsenhet("");
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const isFormValid = oppfolgingsenhet !== "";
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
          onSettled: closeModal,
        },
      );
    }
  }

  return (
    <Dialog>
      <Dialog.Trigger>
        <Button size="small">{text.buttonLabelTildelOppfolgingsenhet}</Button>
      </Dialog.Trigger>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>{text.heading}</Dialog.Title>
          <Dialog.Description>{text.description}</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <BodyLong>
            {getMuligeOppfolgingsenheter.isSuccess && (
              <form id="form" onSubmit={onSubmit}>
                <UNSAFE_Combobox
                  label={text.velgOppfolgingsenhet}
                  options={getMuligeOppfolgingsenheter.data.map((enhet) => ({
                    label: `${enhet.navn} - ${enhet.enhetId}`,
                    value: enhet.enhetId,
                  }))}
                  onToggleSelected={onOppfolgingsenhetChange}
                  className="flex flex-col fixed min-w-[20rem]"
                  error={isFormError && text.formErrorMessage}
                />
                {/* Filler element for fixed combobox */}
                <div className="h-[3.75rem]"></div>
              </form>
            )}
            {getMuligeOppfolgingsenheter.isError && (
              <Alert size="small" variant="error">
                {text.getMuligeOppfolgingsenheterFailedErrorMessage}
              </Alert>
            )}
          </BodyLong>
        </Dialog.Body>
        <Dialog.Footer>
          {getMuligeOppfolgingsenheter.isSuccess && (
            <Button form="form" loading={postTildelOppfolgingsenhet.isPending}>
              {text.endreEnhet}
            </Button>
          )}
          <Dialog.CloseTrigger>
            <Button>Lukk</Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
}
