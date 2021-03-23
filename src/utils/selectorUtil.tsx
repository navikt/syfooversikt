export const skalHenteReducer = (reducer: any) => {
  return !(reducer.henter || reducer.hentet || reducer.hentingFeilet);
};
