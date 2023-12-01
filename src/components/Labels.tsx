import React from 'react';
import { PersonData } from '@/api/types/personregisterTypes';
import { getReadableSkjermingskode } from '@/utils/personDataUtil';
import styled from 'styled-components';
import { Tag } from '@navikt/ds-react';

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

  return (
    <LabelColumnWrapper>
      {showSkjermingskode && (
        <Tag variant="warning" size="small">
          {getReadableSkjermingskode(personData.skjermingskode)}
        </Tag>
      )}
    </LabelColumnWrapper>
  );
};
