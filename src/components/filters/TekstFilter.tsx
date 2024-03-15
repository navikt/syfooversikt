import React, { ReactElement } from 'react';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { Box, Heading, TextField } from '@navikt/ds-react';

const texts = {
  undertittel: 'Navn / Fødselsnummer',
  placeholder: 'Søk på navn eller fødselsnummer',
};

export const TekstFilter = (): ReactElement => {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();

  return (
    <Box
      borderRadius="medium"
      background="surface-default"
      borderColor="border-strong"
      padding="4"
      borderWidth="1"
      className="mb-4"
    >
      <TextField
        size="small"
        label={<Heading size="small">{texts.undertittel}</Heading>}
        description={texts.placeholder}
        value={filterState.tekstFilter}
        onChange={(e) => {
          dispatchFilterAction({
            type: ActionType.SetTekstFilter,
            tekstFilter: e.target.value,
          });
        }}
      />
    </Box>
  );
};
