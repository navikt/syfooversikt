import { Veileder } from '@/api/types/veiledereTypes';
import { sortVeiledereAlphabetically } from './veiledereUtils';
import { ToolbarWrapperProps } from '@/components/toolbar/ToolbarWrapper';

export const assignUsersToSelectedVeileder = (
  { buttonHandler, checkAllHandler }: ToolbarWrapperProps,
  selectedVeilederIdent: string
): void => {
  if (selectedVeilederIdent && selectedVeilederIdent.length > 0) {
    buttonHandler(selectedVeilederIdent);
  }
  checkAllHandler(false);
};

export const filterVeiledereOnInput = (
  veiledere: Veileder[],
  lowerCaseInput: string
): Veileder[] => {
  const filteredVeiledere = veiledere.filter(
    (veileder: Veileder) =>
      lowerCaseInput === '' ||
      veileder.ident.toLowerCase().includes(lowerCaseInput) ||
      veileder.fornavn.toLowerCase().includes(lowerCaseInput) ||
      veileder.etternavn.toLowerCase().includes(lowerCaseInput)
  );

  if (isInputGiven(lowerCaseInput)) {
    return sortVeiledereAlphabetically(filteredVeiledere);
  }
  return filteredVeiledere;
};

export const hasNoCheckedPersoner = (personer: string[]): boolean => {
  return personer.length === 0;
};

export const isInputGiven = (input: string): boolean => {
  return input.length > 0;
};
