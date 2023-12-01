import { PersonData } from '@/api/types/personregisterTypes';
import { toReadableDate } from '@/utils/dateUtils';
import { HourglassTopFilledIcon } from '@navikt/aksel-icons';
import React from 'react';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';
import { Tooltip } from '@navikt/ds-react';
import styled from 'styled-components';

const FristColumnWrapper = styled.div`
  display: flex;
`;

interface FristColumnProps {
  personData: PersonData;
}

export const FristColumn = ({ personData }: FristColumnProps) => {
  const showAvventerFrist =
    personData.aktivitetskrav === AktivitetskravStatus.AVVENT;

  return (
    <FristColumnWrapper>
      {showAvventerFrist && (
        <>
          <Tooltip content="Avventer" arrow={false}>
            <HourglassTopFilledIcon aria-hidden fontSize="1.5rem" />
          </Tooltip>
          {toReadableDate(personData.aktivitetskravVurderingFrist)}
        </>
      )}
    </FristColumnWrapper>
  );
};
