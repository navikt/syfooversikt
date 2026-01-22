import React from 'react';
import { PersonData, Skjermingskode } from '@/api/types/personregisterTypes';
import { Tooltip } from '@navikt/ds-react';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';

interface LabelColumnProps {
  personData: PersonData;
}

export function getReadableSkjermingskode(
  skjermingskode: Skjermingskode
): string {
  switch (skjermingskode) {
    case 'INGEN':
      return 'Ingen';
    case 'DISKRESJONSMERKET':
      return 'Diskresjonsmerket';
    case 'EGEN_ANSATT':
      return 'Egen ansatt';
  }
}

export function Labels({ personData }: LabelColumnProps) {
  const { skjermingskode } = personData;
  const showSkjermingskode = skjermingskode && skjermingskode !== 'INGEN';

  return (
    showSkjermingskode && (
      <Tooltip content={getReadableSkjermingskode(skjermingskode)}>
        <ExclamationmarkTriangleFillIcon
          fontSize="1.5rem"
          color="var(--a-orange-600)"
        />
      </Tooltip>
    )
  );
}
