import { VeilederDTO } from "@/api/types/veiledereTypes";
import { PersonOversiktStatusDTO } from "@/api/types/personoversiktTypes";

export const sortVeiledereBySurnameAsc = (
  veiledere: VeilederDTO[],
  veilederIdentToBeFirst: string,
): VeilederDTO[] => {
  const newVeiledere = [...veiledere];
  const veilederToBeFirstAsList = getAndRemoveVeileder(
    newVeiledere,
    veilederIdentToBeFirst,
  );
  return veilederToBeFirstAsList.concat(
    sortVeiledereAlphabetically(newVeiledere),
  );
};

export const sortVeiledereAlphabetically = (
  veiledere: VeilederDTO[],
): VeilederDTO[] => {
  return [...veiledere].sort((veileder1, veileder2) => {
    const surname1 = veileder1.etternavn.toLowerCase();
    const surname2 = veileder2.etternavn.toLowerCase();
    const firstname1 = veileder1.fornavn.toLowerCase();
    const firstname2 = veileder2.fornavn.toLowerCase();

    return surname1 === surname2
      ? firstname1.localeCompare(firstname2)
      : surname1.localeCompare(surname2);
  });
};

const getAndRemoveVeileder = (
  veiledere: VeilederDTO[],
  ident: string,
): VeilederDTO[] => {
  const veilederToRemoveIndex = veiledere.findIndex(
    (veileder) => veileder.ident === ident,
  );

  return veilederToRemoveIndex > 0
    ? veiledere.splice(veilederToRemoveIndex, 1)
    : [];
};

export const filterVeiledereWithActiveOppgave = (
  veiledere: VeilederDTO[],
  personOversiktStatus: PersonOversiktStatusDTO[],
): VeilederDTO[] => {
  return veiledere.filter((veileder) =>
    personOversiktStatus.some(
      (person) => person.veilederIdent === veileder.ident,
    ),
  );
};

/**
 * Returns the name of a veileder as "Etternavn, Fornavn", or the ident if the veileder has no name.
 */
export function getVeilederLabel(veileder: VeilederDTO): string {
  return veileder.fornavn === ""
    ? veileder.ident
    : `${veileder.etternavn}, ${veileder.fornavn}`;
}

/**
 * Returns the veileder label including the ident, e.g. "Etternavn, Fornavn (Z123456)", so the ident is searchable.
 */
export function getVeilederLabelWithIdent(veileder: VeilederDTO): string {
  return veileder.fornavn === ""
    ? veileder.ident
    : `${getVeilederLabel(veileder)} (${veileder.ident})`;
}
