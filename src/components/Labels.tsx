import React from 'react';
import { PersonData } from '@/api/types/personregisterTypes';
import { getReadableSkjermingskode } from '@/utils/personDataUtil';
import styled from 'styled-components';
import { AktivitetskravStatus } from '@/api/types/personoversiktTypes';
import { EtikettFokus } from 'nav-frontend-etiketter';
import { toReadableDate } from '@/utils/dateUtils';

const LabelColumnWrapper = styled.div`
  padding: 0.5em 0;

  > * {
    margin: 0.2em;
  }
`;

interface LabelColumnProps {
  personData: PersonData;
}

export const Labels = ({ personData }: LabelColumnProps) => {
  const showSkjermingskode =
    personData.skjermingskode && personData.skjermingskode !== 'INGEN';
  const showAktivitetskrav =
    personData.aktivitetskrav === AktivitetskravStatus.AVVENT;

  return (
    <LabelColumnWrapper>
      {showSkjermingskode && (
        <EtikettFokus mini>
          {getReadableSkjermingskode(personData.skjermingskode)}
        </EtikettFokus>
      )}

      {showAktivitetskrav && (
        <EtikettFokus mini>
          {`Avventer (${toReadableDate(personData.aktivitetskravUpdatedAt)})`}
        </EtikettFokus>
      )}
    </LabelColumnWrapper>
  );
};
