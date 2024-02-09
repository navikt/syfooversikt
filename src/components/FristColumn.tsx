import { PersonData } from '@/api/types/personregisterTypes';
import { toReadableDate } from '@/utils/dateUtils';
import { FileTextIcon, HourglassTopFilledIcon } from '@navikt/aksel-icons';
import React, { ReactElement } from 'react';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';
import { Tooltip } from '@navikt/ds-react';

const texts = {
  tooltipAvventer: 'Avventer',
  tooltipOppfolgingsoppgave: 'Oppfølgingsoppgave',
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

  return (
    <>
      {frister.sort(byFristAsc).map(({ date, icon, tooltip }, index) => (
        <div key={index} className="flex flex-wrap">
          <Tooltip content={tooltip} arrow={false}>
            {icon()}
          </Tooltip>
          {toReadableDate(date)}
        </div>
      ))}
    </>
  );
};
