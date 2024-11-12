import React from 'react';
import { BodyLong, BodyShort, Label, Modal } from '@navikt/ds-react';
import {
  oppfolgingsgrunnToString,
  OppfolgingsoppgaveDTO,
} from '@/api/types/personoversiktTypes';
import { toReadableDate } from '@/utils/dateUtils';

const texts = {
  header: 'Oppfølgingsoppgave',
  oppfolgingsgrunn: 'Oppfølgingsgrunn',
  frist: 'Frist',
};

interface Props {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  oppfolgingsoppgave: OppfolgingsoppgaveDTO;
  sykmeldtNavn: string;
}

export default function OppfolgingsoppgaveModal({
  isOpen,
  setOpen,
  oppfolgingsoppgave,
  sykmeldtNavn,
}: Props) {
  return (
    <Modal
      closeOnBackdropClick
      className="w-full max-w-[50rem]"
      aria-label="oppfølgingsoppgave"
      open={isOpen}
      onClose={() => setOpen(false)}
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
          {oppfolgingsgrunnToString[oppfolgingsoppgave.oppfolgingsgrunn]}
        </BodyShort>
        <BodyLong className="mb-4">{oppfolgingsoppgave.tekst}</BodyLong>
        <Label size="small" as="p">
          {texts.frist}
        </Label>
        <BodyShort>{toReadableDate(oppfolgingsoppgave.frist)}</BodyShort>
      </Modal.Body>
    </Modal>
  );
}
