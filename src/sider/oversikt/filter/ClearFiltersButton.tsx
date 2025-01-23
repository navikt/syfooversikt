import React, { ReactElement } from 'react';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { Button } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';

const texts = {
  nullstill: 'Nullstill valg',
};

export const ClearFiltersButton = (): ReactElement => {
  const { dispatch: dispatchFilterAction } = useFilters();

  return (
    <Button
      variant="tertiary"
      size="small"
      icon={<TrashIcon title="a11y-title" fontSize="1.5rem" />}
      onClick={() => {
        dispatchFilterAction({
          type: ActionType.ResetFilters,
        });
      }}
    >
      {texts.nullstill}
    </Button>
  );
};
