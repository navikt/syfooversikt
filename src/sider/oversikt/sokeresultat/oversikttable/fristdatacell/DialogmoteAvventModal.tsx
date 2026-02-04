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
        <dl>
          <dt>
            <Label size="small" as="span">
              {texts.beskrivelse}
            </Label>
          </dt>
          <dd className="mb-4 whitespace-pre-wrap ml-0">
            <BodyLong>{avvent.beskrivelse}</BodyLong>
          </dd>
          <dt>
            <Label size="small" as="span">
              {texts.frist}
            </Label>
          </dt>
          <dd className="ml-0">
            <BodyShort>{toReadableDate(avvent.frist)}</BodyShort>
          </dd>
        </dl>
      </Modal.Body>
    </Modal>
  );
}
