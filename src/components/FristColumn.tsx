import { PersonData } from '@/api/types/personregisterTypes';
import { toReadableDate } from '@/utils/dateUtils';
import { FileTextIcon, HourglassTopFilledIcon } from '@navikt/aksel-icons';
import React, { ReactElement } from 'react';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';
import { Tooltip } from '@navikt/ds-react';
import styled from 'styled-components';

const FristWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const texts = {
  tooltipAvventer: 'Avventer',
  tooltipTrengerOppfolging: 'Trenger oppfølging',
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
    trengerOppfolgingFrist,
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
  if (trengerOppfolgingFrist) {
    frister.push({
      icon: () => <FileTextIcon aria-hidden fontSize="1.5rem" />,
      date: trengerOppfolgingFrist,
      tooltip: texts.tooltipTrengerOppfolging,
    });
  }

  return (
    <>
      {frister.sort(byFristAsc).map(({ date, icon, tooltip }, index) => (
        <FristWrapper key={index}>
          <Tooltip content={tooltip} arrow={false}>
            {icon()}
          </Tooltip>
          {toReadableDate(date)}
        </FristWrapper>
      ))}
    </>
  );
};
