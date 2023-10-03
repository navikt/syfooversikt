const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const randomChoice = (choices: string[]) => {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
};

const generateName = () => {
  const e = [
    'Banan',
    'Eple',
    'Fersken',
    'Rambutan',
    'Durian',
    'Stjernefrukt',
    'Tomat',
    'Drue',
    'Vannmelon',
    'Nektarin',
    'Mandarin',
    'Persimon',
  ] as string[];
  const f = [
    'Rød',
    'Gul',
    'Blå',
    'Grønn',
    'Rosa',
    'Oransje',
    'Sort',
    'Lilla',
    'Hvit',
    'Turkis',
    'Fiolett',
    'Infrarød',
  ] as string[];

  return `${randomChoice(f)} ${randomChoice(e)}`;
};

export interface MockPerson {
  name: string;
  fnr: string;
  skjermingskode: string;
}

export const generatePerson = (): MockPerson => {
  const name = generateName();
  const fnr = getRandomInt(31999999999).toString().padStart(11, '0');
  return {
    name,
    fnr,
    skjermingskode: 'INGEN',
  };
};

export const generatePersons = (amount: number) =>
  new Array(amount).fill(generatePerson());

export const generatePersonoversiktEnhetFromPersons = (
  persons: MockPerson[]
) => {
  return persons.map((person: MockPerson) => {
    return {
      fnr: person.fnr,
      navn: generateName(),
      enhet: '0316',
      veilederIdent: 'Z202020',
      motebehovUbehandlet: null,
      oppfolgingsplanLPSBistandUbehandlet: null,
      dialogmotekandidat: undefined,
      motestatus: undefined,
      dialogmotesvarUbehandlet: false,
      behandlerdialogUbehandlet: false,
      aktivitetskravVurderStansUbehandlet: false,
    };
  });
};
