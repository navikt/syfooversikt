import { BodyLong, BodyShort, Label, Modal } from '@navikt/ds-react';
import { toReadableDate } from '@/utils/dateUtils';
import React from 'react';
import { AktivitetskravvurderingDTO } from '@/api/types/aktivitetskravDTO';
import { avventVurderingArsakTexts } from '@/api/types/personoversiktTypes';
import { trackModalApnet, trackModalLukket } from '@/utils/umami';

const texts = {
  header: 'Aktivitetskrav avvent vurdering',
  avventArsak: 'Årsak',
  frist: 'Frist',
  ingenArsakOppgitt: 'Ingen årsak oppgitt',
};

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  vurdering: AktivitetskravvurderingDTO;
  sykmeldtNavn: string;
}

export default function AktivitetskravAvventModal({
  isOpen,
  setIsOpen,
  vurdering,
  sykmeldtNavn,
}: Props) {
  const arsaker = vurdering?.arsaker.map(
    (arsak) => avventVurderingArsakTexts[arsak]
  );
  const frist = toReadableDate(vurdering?.frist ?? null);

  function arsakerText() {
    if (!arsaker || arsaker.length === 0) {
      return texts.ingenArsakOppgitt;
    } else {
      return `${arsaker.join(', ')}`;
    }
  }

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
          {texts.avventArsak}
        </Label>
        <BodyShort className="mb-4">{arsakerText()}</BodyShort>
        <BodyLong className="mb-4 whitespace-pre-wrap">
          {vurdering?.beskrivelse}
        </BodyLong>
        <Label size="small" as="p">
          {texts.frist}
        </Label>
        <BodyShort>{frist}</BodyShort>
      </Modal.Body>
    </Modal>
  );
}
