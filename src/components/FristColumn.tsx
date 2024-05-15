import { PersonData } from '@/api/types/personregisterTypes';
import { toReadableDate } from '@/utils/dateUtils';
import {
  FileTextIcon,
  HourglassTopFilledIcon,
  BriefcaseIcon,
} from '@navikt/aksel-icons';
import React, { ReactElement } from 'react';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';
import { Tooltip } from '@navikt/ds-react';

const texts = {
  tooltipAvventer: 'Avventer til',
  tooltipOppfolgingsoppgave: 'Oppfølgingsoppgave frist',
  tooltipFriskmeldingTilArbeidsformidling: '§8-5 f.o.m.',
};

interface FristColumnProps {
  personData: PersonData;
}

type Frist = {
  icon: () => ReactElement;
  date: Date;
  tooltip: string;
};

const byFristAsc = (fristA: Frist, fristB: Frist) => {
  return fristA.date > fristB.date ? 1 : -1;
};

export const FristColumn = ({ personData }: FristColumnProps) => {
  const {
    aktivitetskrav,
    aktivitetskravVurderingFrist,
    oppfolgingsoppgaveFrist,
    friskmeldingTilArbeidsformidlingFom,
  } = personData;
  const frister: Frist[] = [];
  if (
    aktivitetskrav === AktivitetskravStatus.AVVENT &&
    aktivitetskravVurderingFrist
  ) {
    frister.push({
      icon: () => <HourglassTopFilledIcon aria-hidden fontSize="1.5rem" />,
      date: aktivitetskravVurderingFrist,
      tooltip: texts.tooltipAvventer,
    });
  }
  if (oppfolgingsoppgaveFrist) {
    frister.push({
      icon: () => <FileTextIcon aria-hidden fontSize="1.5rem" />,
      date: oppfolgingsoppgaveFrist,
      tooltip: texts.tooltipOppfolgingsoppgave,
    });
  }

  if (friskmeldingTilArbeidsformidlingFom) {
    frister.push({
      icon: () => <BriefcaseIcon aria-hidden fontSize="1.5rem" />,
      date: friskmeldingTilArbeidsformidlingFom,
      tooltip: texts.tooltipFriskmeldingTilArbeidsformidling,
    });
  }

  return (
    <>
      {frister.sort(byFristAsc).map(({ date, icon, tooltip }, index) => (
        <div key={index} className="flex flex-wrap items-center">
          <Tooltip content={tooltip} arrow={false}>
            {icon()}
          </Tooltip>
          <div>{toReadableDate(date)}</div>
        </div>
      ))}
    </>
  );
};
