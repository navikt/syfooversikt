import { BodyLong, BodyShort, Label, Modal } from '@navikt/ds-react';
import { toReadableDate } from '@/utils/dateUtils';
import React from 'react';
import { AvventDTO } from '@/api/types/dialogmotekandidatDTO';

const texts = {
  header: 'Dialogmøte avvent vurdering',
  beskrivelse: 'Beskrivelse',
  frist: 'Frist',
};

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  avvent: AvventDTO;
  sykmeldtNavn: string;
}

export default function DialogmoteAvventModal({
  isOpen,
  setIsOpen,
  avvent,
  sykmeldtNavn,
}: Props) {
  return (
    <Modal
      closeOnBackdropClick
      className="w-full max-w-[50rem]"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      header={{
        label: sykmeldtNavn,
        heading: texts.header,
      }}
    >
      <Modal.Body>
        <Label size="small" as="p" id="avvent-beskrivelse">
          {texts.beskrivelse}
        </Label>
        <BodyLong
          className="mb-4 whitespace-pre-wrap"
          aria-labelledby="avvent-beskrivelse"
        >
          {avvent.beskrivelse}
        </BodyLong>
        <Label size="small" as="p" id="avvent-frist">
          {texts.frist}
        </Label>
        <BodyShort aria-labelledby="avvent-frist">
          {toReadableDate(avvent.frist)}
        </BodyShort>
      </Modal.Body>
    </Modal>
  );
}
