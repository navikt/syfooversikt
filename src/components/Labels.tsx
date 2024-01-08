import React from 'react';
import { PersonData } from '@/api/types/personregisterTypes';
import { getReadableSkjermingskode } from '@/utils/personDataUtil';
import { Tooltip } from '@navikt/ds-react';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

interface LabelColumnProps {
  personData: PersonData;
}

export const Labels = ({ personData }: LabelColumnProps) => {
  const { skjermingskode } = personData;
  const showSkjermingskode = skjermingskode && skjermingskode !== 'INGEN';

  return (
    <div className="flex">
      {showSkjermingskode && (
        <Tooltip content={getReadableSkjermingskode(skjermingskode)}>
          <ExclamationmarkTriangleFillIcon
            fontSize="1.5rem"
            color="var(--a-orange-600)"
          />
        </Tooltip>
      )}
    </div>
  );
};
