import {
  Box,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  useRangeDatepicker,
} from '@navikt/ds-react';
import { DatoFilterOption } from '@/utils/hendelseFilteringUtils';
import React from 'react';
import { ActionType } from '@/context/filters/filterContextActions';
import { useFilters } from '@/context/filters/FilterContext';
import { DateRange } from '@/sider/oversikt/filter/types.ts';

const texts = {
  legend: 'Dato',
  option: {
    past: 'Før dagens dato',
    today: 'Dagens dato',
    future: 'Fremtidige datoer',
    custom: 'Egendefinerte datoer',
  },
  datePicker: {
    description: 'Format: dd.mm.åååå',
    labelFrom: 'Fra',
    labelTo: 'Til',
  },
};

export default function DatoFilter() {
  const { filterState, dispatch: dispatchFilterAction } = useFilters();
  const selectedDatoOptions =
    filterState.selectedFristFilters.selectedDatoOptions;
  const selectedDateTo = filterState.selectedFristFilters.selectedDateRange.to;
  const selectedDateFrom =
    filterState.selectedFristFilters.selectedDateRange.from;

  const onDatoFilterOptionChange = (datoFilters: DatoFilterOption[]) => {
    dispatchFilterAction({
      type: ActionType.SetSelectedDatoFilter,
      selectedDatoFilters: {
        selectedDatoOptions: datoFilters,
        selectedDateRange: filterState.selectedFristFilters.selectedDateRange,
      },
    });
  };

  const onDatoRangeChange = (dateRange: DateRange | undefined) => {
    dispatchFilterAction({
      type: ActionType.SetSelectedDatoFilter,
      selectedDatoFilters: {
        selectedDatoOptions: selectedDatoOptions,
        selectedDateRange: {
          from: dateRange?.from,
          to: dateRange?.to,
        },
      },
    });
  };

  const { datepickerProps, toInputProps, fromInputProps } = useRangeDatepicker({
    onRangeChange: (dateRange) => onDatoRangeChange(dateRange),
    allowTwoDigitYear: true,
    defaultSelected: {
      to: selectedDateTo,
      from: selectedDateFrom,
    },
  });

  return (
    <CheckboxGroup
      legend={texts.legend}
      onChange={(val: DatoFilterOption[]) => onDatoFilterOptionChange(val)}
      value={selectedDatoOptions}
      size="small"
    >
      <Checkbox value={DatoFilterOption.Past}>{texts.option.past}</Checkbox>
      <Checkbox value={DatoFilterOption.Today}>{texts.option.today}</Checkbox>
      <Checkbox value={DatoFilterOption.Future}>{texts.option.future}</Checkbox>
      <Checkbox value={DatoFilterOption.Custom}>{texts.option.custom}</Checkbox>

      {selectedDatoOptions?.includes(DatoFilterOption.Custom) && (
        <Box className={'ml-4 mt-2'}>
          <DatePicker {...datepickerProps}>
            <DatePicker.Input
              {...fromInputProps}
              label={texts.datePicker.labelFrom}
              description={texts.datePicker.description}
              className={'mb-2'}
            />
            <DatePicker.Input
              {...toInputProps}
              label={texts.datePicker.labelTo}
              description={texts.datePicker.description}
            />
          </DatePicker>
        </Box>
      )}
    </CheckboxGroup>
  );
}
