import React from 'react';
import { BodyLong, BodyShort, Label, Modal } from '@navikt/ds-react';
import {
  oppfolgingsgrunnToString,
  OppfolgingsoppgaveDTO,
} from '@/api/types/personoversiktTypes';
import { toReadableDate } from '@/utils/dateUtils';
import { trackModalApnet, trackModalLukket } from '@/utils/umami';

const texts = {
  header: 'Oppfølgingsoppgave',
  oppfolgingsgrunn: 'Oppfølgingsgrunn',
  frist: 'Frist',
};

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  oppfolgingsoppgave: OppfolgingsoppgaveDTO;
  sykmeldtNavn: string;
}

export default function OppfolgingsoppgaveModal({
  isOpen,
  setIsOpen,
  oppfolgingsoppgave,
  sykmeldtNavn,
}: Props) {
  if (isOpen) {
    trackModalApnet(texts.header);
  }

  function handleClose() {
    trackModalLukket(texts.header);
    setIsOpen(false);
  }

  return (
    <Modal
      closeOnBackdropClick
      className="w-full max-w-[50rem]"
      open={isOpen}
      onClose={handleClose}
      header={{
        label: sykmeldtNavn,
        heading: texts.header,
      }}
    >
      <Modal.Body>
        <Label size="small" as="p">
          {texts.oppfolgingsgrunn}
        </Label>
        <BodyShort className="mb-4">
          {oppfolgingsgrunnToString[oppfolgingsoppgave.oppfolgingsgrunn]?.long}
        </BodyShort>
        <BodyLong className="mb-4 whitespace-pre-wrap">
          {oppfolgingsoppgave.tekst}
        </BodyLong>
        <Label size="small" as="p">
          {texts.frist}
        </Label>
        <BodyShort>{toReadableDate(oppfolgingsoppgave.frist)}</BodyShort>
      </Modal.Body>
    </Modal>
  );
}
