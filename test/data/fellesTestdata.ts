const veilederIdent = "Z101010";
const enhetId = "0316";

export const testdata = {
  fnr1: "01999911111",
  fnr2: "99999922222",
  fnr3: "59999933333",
  fnr4: "99999944444",
  navn1: "Et navn",
  navn2: "Et annet navn",
  navn3: "Nok et navn..",
  navn4: "Nok et navn igjen",
  enhetId,
  veilederIdent,
  skjermingskode: {
    ingen: "INGEN",
    diskresjonsmerket: "DISKRESJONSMERKET",
    egenAnsatt: "EGEN_ANSATT",
  },
} as const;

export const personregister = {
  [testdata.fnr1]: {
    navn: testdata.navn1,
    harMotebehovUbehandlet: true,
    harDialogmotesvar: true,
    skjermingskode: testdata.skjermingskode.ingen,
    tildeltVeilederIdent: "Z999999",
    fodselsdato: null,
    harOppfolgingsplanLPSBistandUbehandlet: false,
    dialogmotekandidatStatus: null,
    harBehandlerdialogUbehandlet: false,
    behandlerBerOmBistandUbehandlet: false,
    friskmeldingTilArbeidsformidlingFom: null,
    arbeidsuforhetvurdering: null,
    senOppfolgingKandidat: null,
    oppfolgingsoppgave: null,
    aktivitetskravvurdering: null,
    manglendeMedvirkning: null,
    isAktivKartleggingssporsmalVurdering: false,
    harUtenlandsoppholdSoknadUbehandlet: false,
    dialogmoteAvvent: null,
  },
  [testdata.fnr2]: {
    navn: testdata.navn2,
    harMotebehovUbehandlet: false,
    harDialogmotesvar: false,
    skjermingskode: testdata.skjermingskode.egenAnsatt,
    tildeltVeilederIdent: "Z999999",
    fodselsdato: null,
    harOppfolgingsplanLPSBistandUbehandlet: false,
    dialogmotekandidatStatus: null,
    harBehandlerdialogUbehandlet: false,
    behandlerBerOmBistandUbehandlet: false,
    friskmeldingTilArbeidsformidlingFom: null,
    arbeidsuforhetvurdering: null,
    senOppfolgingKandidat: null,
    oppfolgingsoppgave: null,
    aktivitetskravvurdering: null,
    manglendeMedvirkning: null,
    isAktivKartleggingssporsmalVurdering: false,
    harUtenlandsoppholdSoknadUbehandlet: false,
    dialogmoteAvvent: null,
  },
} as const;

export const veiledere = [
  {
    ident: "Z999999",
    fornavn: "Veil",
    etternavn: "Eder",
  },
  {
    ident: "Z000000",
    fornavn: "NAV",
    etternavn: "Ansatt",
  },
];
