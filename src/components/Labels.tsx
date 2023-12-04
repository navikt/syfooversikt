import React from 'react';
import { PersonData } from '@/api/types/personregisterTypes';
import { getReadableSkjermingskode } from '@/utils/personDataUtil';
import styled from 'styled-components';
import { Tooltip } from '@navikt/ds-react';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

const LabelColumnWrapper = styled.div`
  display: flex;
`;

interface LabelColumnProps {
  personData: PersonData;
}

export const Labels = ({ personData }: LabelColumnProps) => {
  const { skjermingskode } = personData;
  const showSkjermingskode = skjermingskode && skjermingskode !== 'INGEN';

  return (
    <LabelColumnWrapper>
      {showSkjermingskode && (
        <Tooltip content={getReadableSkjermingskode(skjermingskode)}>
          <ExclamationmarkTriangleFillIcon
            aria-hidden
            fontSize="1.5rem"
            color="var(--a-orange-600)"
          />
        </Tooltip>
      )}
    </LabelColumnWrapper>
  );
};
