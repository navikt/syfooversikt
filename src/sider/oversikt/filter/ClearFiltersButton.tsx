import React, { ReactElement } from 'react';
import { useFilters } from '@/context/filters/FilterContext';
import { ActionType } from '@/context/filters/filterContextActions';
import { Button } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import * as Amplitude from '@/utils/amplitude';
import { EventType } from '@/utils/amplitude';

const texts = {
  nullstill: 'Nullstill valg',
};

export const ClearFiltersButton = (): ReactElement => {
  const { dispatch: dispatchFilterAction } = useFilters();

  function handleButtonClick() {
    dispatchFilterAction({
      type: ActionType.ResetFilters,
    });

    Amplitude.logEvent({
      type: EventType.ButtonClick,
      data: {
        url: window.location.href,
        tekst: 'Nullstill valg',
      },
    });
  }

  return (
    <Button
      variant="tertiary"
      size="small"
      icon={<TrashIcon title="a11y-title" fontSize="1.5rem" />}
      onClick={handleButtonClick}
      className="max-w-max"
    >
      {texts.nullstill}
    </Button>
  );
};
