import { VeilederDTO } from '@/api/types/veiledereTypes';
import { sortVeiledereAlphabetically } from './veiledereUtils';

export const filterVeiledereOnInput = (
  veiledere: VeilederDTO[],
  lowerCaseInput: string
): VeilederDTO[] => {
  const filteredVeiledere = veiledere.filter(
    (veileder: VeilederDTO) =>
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

export const isInputGiven = (input: string): boolean => {
  return input.length > 0;
};
