import {
  Alert,
  BodyLong,
  Button,
  Modal,
  Skeleton,
  UNSAFE_Combobox,
} from '@navikt/ds-react';
import React, { useState } from 'react';
import {
  Enhet,
  useGetMuligeOppfolgingsenheter,
} from '@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/hooks/useGetMuligeOppfolgingsenheter';
import { useNotifications } from '@/context/notification/NotificationContext';
import { Notification } from '@/context/notification/Notifications';
import {
  OppfolgingsenhetTildelingerResponseDTO,
  usePostTildelOppfolgingsenhet,
} from '@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/hooks/usePostTildelOppfolgingsenhet';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';

const text = {
  heading: 'Endre oppfølgingsenhet',
  description:
    'Her kan du flytte den sykmeldte til en annen oppfølgingsenhet. Dersom den sykemeldte har endret bostedsadresse, skjer flyttingen automatisk.',
  velgOppfolgingsenhet: 'Velg ny oppfølgingsenhet',
  formErrorMessage: 'Du må velge en oppfølgingsenhet',
  getMuligeOppfolgingsenheterFailedErrorMessage:
    'Noe gikk galt. Klarer ikke å hente mulig enheter å tildele til.',
  buttonLabel: 'Tildel oppfølgingsenhet',
  endreEnhet: 'Endre oppfølgingsenhet',
  avbryt: 'Avbryt',
};

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
  selectedPersoner: string[];
  setSelectedPersoner: (personer: string[]) => void;
}

const tildelOppfolgingsenhetFailed: Notification = {
  type: 'tildelOppfolgingsenhetFailed',
  variant: 'error',
  message: 'Tildeling av oppfølgingsenhet feilet.',
};

const tildelOppfolgingsenhetSuccess = (
  antallTildelt: number,
  antallMaybeTildelt: number,
  enhet: string
): Notification => {
  const message = () => {
    if (antallTildelt > 1) {
      return `${antallTildelt} av ${antallMaybeTildelt} personer tildelt ${enhet}.`;
    } else {
      return `En person tildelt ${enhet}.`;
    }
  };
  return {
    type: 'tildelOppfolgingsenhetSuccess',
    variant: 'success',
    header: 'Brukere flyttet',
    message: message(),
  };
};

export default function TildelOppfolgingsenhetModal({
  ref,
  selectedPersoner,
  setSelectedPersoner,
}: Props) {
  const { aktivEnhet } = useAktivEnhet();
  const getMuligeOppfolgingsenheter = useGetMuligeOppfolgingsenheter();
  const postTildelOppfolgingsenhet = usePostTildelOppfolgingsenhet();
  const [oppfolgingsenhet, setOppfolgingsenhet] = useState<string>('');
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const { displayNotification } = useNotifications();

  function muligeOppfolgingsenheterOptions(
    enheter: Enhet[]
  ): { label: string; value: string }[] {
    return sortAlphabetically(enheter)
      .filter((enhet) => enhet.enhetId !== aktivEnhet)
      .map((enhet) => ({
        label: `${enhet.navn} - ${enhet.enhetId}`,
        value: enhet.enhetId,
      }));
  }

  function sortAlphabetically(enhet: Enhet[]) {
    return enhet.sort((enhetA, enhetB) => (enhetA.navn > enhetB.navn ? 1 : -1));
  }

  function onOppfolgingsenhetChange(option: string, isSelected: boolean) {
    if (isSelected) {
      setIsFormError(false);
      setOppfolgingsenhet(option);
    } else {
      setIsFormError(true);
      setOppfolgingsenhet('');
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const isFormValid = oppfolgingsenhet !== '';
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
            const tildeltOppfolgingsenhet = getMuligeOppfolgingsenheter.data?.find(
              (enhet) => enhet.enhetId === oppfolgingsenhet
            );
            const antallTildelt = response.tildelinger.length;
            const antallMaybeTildelt = selectedPersoner.length;
            displayNotification(
              tildelOppfolgingsenhetSuccess(
                antallTildelt,
                antallMaybeTildelt,
                `${tildeltOppfolgingsenhet?.navn} - ${tildeltOppfolgingsenhet?.enhetId}`
              )
            );
            setSelectedPersoner([]);
          },
          onError: () => displayNotification(tildelOppfolgingsenhetFailed),
        }
      );
      ref.current?.close();
    }
  }

  return (
    <Modal ref={ref} header={{ heading: text.heading }}>
      <Modal.Body className="flex flex-col gap-4">
        {getMuligeOppfolgingsenheter.isLoading && (
          <>
            <Skeleton variant="rectangle" width="100%" height={300} />
            <Skeleton variant="rectangle" width="100%" height={300} />
          </>
        )}
        {getMuligeOppfolgingsenheter.isSuccess && (
          <>
            <BodyLong>{text.description}</BodyLong>
            <form id="form" onSubmit={onSubmit}>
              <UNSAFE_Combobox
                label={text.velgOppfolgingsenhet}
                size="small"
                options={muligeOppfolgingsenheterOptions(
                  getMuligeOppfolgingsenheter.data
                )}
                onToggleSelected={onOppfolgingsenhetChange}
                className="flex flex-col fixed min-w-[20rem]"
                error={isFormError && text.formErrorMessage}
              />
              {/* Filler element for fixed combobox */}
              <div className="h-[3.75rem]"></div>
            </form>
          </>
        )}
        {getMuligeOppfolgingsenheter.isError && (
          <Alert size="small" variant="error">
            {text.getMuligeOppfolgingsenheterFailedErrorMessage}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        {getMuligeOppfolgingsenheter.isSuccess && (
          <Button form="form">{text.endreEnhet}</Button>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={() => ref.current?.close()}
        >
          {text.avbryt}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
