import fs from 'fs';
import path from 'path';

const readDataFromJsonFile = (filename: any) => {
  const rawData = fs.readFileSync(path.join(__dirname, `/Data/${filename}`));
  return JSON.parse(rawData.toString());
};

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

interface MockPerson {
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
  new Array(amount).fill({}).map((_) => generatePerson());

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
    };
  });
};

export const personInfo = readDataFromJsonFile('personInfo.json');
export const personoversiktEnhet = readDataFromJsonFile(
  'personoversiktEnhet.json'
);
export const veiledere = readDataFromJsonFile('veiledere.json');
export const veilederInfo = readDataFromJsonFile('veilederInfo.json');
export const aktivEnhet = readDataFromJsonFile('aktivEnhet.json');
