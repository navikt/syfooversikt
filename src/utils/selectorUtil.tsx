export const skalHenteReducer = (reducer: any) => {
  return !(reducer.henter || reducer.hentet || reducer.hentingFeilet);
};

export const hentVeilederEnhetFraState = (state: any) => {
  const reducer = state.veilederenheter;
  return reducer && reducer.hentet ? reducer.aktivEnhet : undefined;
};
