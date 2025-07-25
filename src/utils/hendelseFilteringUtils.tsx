import {
  PersonData,
  PersonregisterState,
} from '@/api/types/personregisterTypes';
import {
  firstCompanyNameFromPersonData,
  getEarliestFrist,
  getLatestFrist,
} from './personDataUtil';
import { VeilederDTO } from '@/api/types/veiledereTypes';
import { HendelseTypeFilter } from '@/context/filters/filterContextState';
import { isFuture, isPast, isToday } from '@/utils/dateUtils';
import { SortDirection, Sorting } from '@/hooks/useSorting';
import { getHendelser } from './hendelseColumnUtils';

export class Filterable<T> {
  value: T;

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  applyFilter(filter: (currentValue: T) => T): Filterable<T> {
    return new Filterable<T>(filter(this.value));
  }
}

const hasCompany = (personData: PersonData) =>
  personData.latestOppfolgingstilfelle?.virksomhetList &&
  personData.latestOppfolgingstilfelle.virksomhetList.length > 0;

export function filterOnFodselsnummerOrName(
  personregister: PersonregisterState,
  sok: string
): PersonregisterState {
  if (sok.length === 0) {
    return personregister;
  }

  const filtered = Object.entries(personregister).filter(([fnr, { navn }]) => {
    return (
      fnr.toLowerCase().indexOf(sok.toLowerCase()) > -1 ||
      (navn && navn.toLowerCase().indexOf(sok.toLocaleLowerCase()) > -1)
    );
  });

  return Object.fromEntries(filtered);
}

const getBirthDateFromFnr = (fnr: string): string => fnr.slice(0, 2);

export function filterOnCompany(
  personregister: PersonregisterState,
  companies: string[]
): PersonregisterState {
  if (!companies || companies.length === 0) {
    return personregister;
  }

  const filtered = Object.entries(personregister)
    .filter(([, persondata]) => hasCompany(persondata))
    .filter(([, { latestOppfolgingstilfelle }]) => {
      return latestOppfolgingstilfelle?.virksomhetList.some(
        (virksomhet) =>
          virksomhet.virksomhetsnavn &&
          companies.indexOf(virksomhet.virksomhetsnavn) !== -1
      );
    });

  return Object.fromEntries(filtered);
}

export function filterOnBirthDates(
  personregister: PersonregisterState,
  birthDates: string[]
): PersonregisterState {
  if (birthDates.length === 0) return personregister;

  const filtered = Object.entries(personregister).filter(([fnr]) => {
    const birthDate = getBirthDateFromFnr(fnr);
    return birthDates.indexOf(birthDate) !== -1;
  });

  return Object.fromEntries(filtered);
}

export enum FristFilterOption {
  Past = 'Past',
  Today = 'Today',
  Future = 'Future',
}

export function filterOnFrist(
  personregister: PersonregisterState,
  selectedFristFilters: FristFilterOption[]
): PersonregisterState {
  const isNoFilter = selectedFristFilters.length === 0;
  if (isNoFilter) {
    return personregister;
  }
  const filtered = Object.entries(personregister).filter(([, persondata]) => {
    const frister = [
      persondata.arbeidsuforhetvurdering?.varsel?.svarfrist,
      persondata.manglendeMedvirkning?.varsel?.svarfrist,
      persondata.aktivitetskravvurdering?.vurderinger[0]?.frist,
      persondata.aktivitetskravvurdering?.vurderinger[0]?.varsel?.svarfrist,
      persondata.oppfolgingsoppgave?.frist,
      persondata.friskmeldingTilArbeidsformidlingFom,
    ];

    if (frister.every((frist) => frist === null)) {
      return true;
    }

    return frister.some(
      (frist) => frist && isInFristFilter(selectedFristFilters, frist)
    );
  });

  return Object.fromEntries(filtered);
}

function isInFristFilter(
  selectedFilters: FristFilterOption[],
  fristDate: Date
): boolean {
  return selectedFilters.some((fristFilter) => {
    switch (fristFilter) {
      case FristFilterOption.Past:
        return isPast(fristDate);
      case FristFilterOption.Today:
        return isToday(fristDate);
      case FristFilterOption.Future:
        return isFuture(fristDate);
    }
  });
}

export enum AgeFilterOption {
  BelowThirty = 'BelowThirty',
  ThirtyAndAbove = 'ThirtyAndAbove',
}

export function filterOnAge(
  personregister: PersonregisterState,
  selectedAgeFilters: AgeFilterOption[]
): PersonregisterState {
  const isNoFilter = selectedAgeFilters.length === 0;
  if (isNoFilter) {
    return personregister;
  }
  const currentYear = new Date().getFullYear();
  const filtered = Object.entries(personregister).filter(([fnr]) => {
    const age = ageFromFnr(fnr, currentYear);
    return isAgeInFilters(age, selectedAgeFilters);
  });
  return Object.fromEntries(filtered);
}

function ageFromFnr(fnr: string, currentYear: number): number {
  const currentYearLastTwoDigits = parseInt(currentYear.toString().slice(2));
  const yearBornLastTwoDigits = parseInt(fnr.slice(4, 6));
  let age;
  if (currentYearLastTwoDigits > yearBornLastTwoDigits) {
    age = currentYearLastTwoDigits - yearBornLastTwoDigits;
  } else {
    age = 100 - yearBornLastTwoDigits + currentYearLastTwoDigits;
  }
  return age;
}

function isAgeInFilters(
  age: number,
  selectedAgeFilters: AgeFilterOption[]
): boolean {
  return selectedAgeFilters.some((ageFilter) => {
    switch (ageFilter) {
      case AgeFilterOption.BelowThirty:
        return age < 30;
      case AgeFilterOption.ThirtyAndAbove:
        return age >= 30;
    }
  });
}

function isPersonVisible(
  filters: HendelseTypeFilter,
  personData: PersonData
): boolean {
  const isExpiredVarsel =
    !!personData?.aktivitetskravvurdering?.vurderinger[0]?.varsel?.svarfrist &&
    isPast(
      personData?.aktivitetskravvurdering.vurderinger[0]?.varsel?.svarfrist
    );
  return (
    (filters.onskerMote && personData.harMotebehovUbehandlet) ||
    (filters.arbeidsgiverOnskerMote &&
      personData.harOppfolgingsplanLPSBistandUbehandlet) ||
    (filters.dialogmotekandidat && personData.dialogmotekandidat === true) ||
    (filters.dialogmotesvar && personData.harDialogmotesvar) ||
    (filters.behandlerdialog && personData.harBehandlerdialogUbehandlet) ||
    (filters.oppfolgingsoppgave && personData.oppfolgingsoppgave !== null) ||
    (filters.behandlerBerOmBistand &&
      personData.behandlerBerOmBistandUbehandlet) ||
    (filters.isAktivArbeidsuforhetvurdering &&
      !!personData.arbeidsuforhetvurdering) ||
    (filters.harFriskmeldingTilArbeidsformidling &&
      !!personData.friskmeldingTilArbeidsformidlingFom) ||
    (filters.isSenOppfolgingChecked && !!personData.senOppfolgingKandidat) ||
    (filters.isManglendeMedvirkningChecked &&
      !!personData.manglendeMedvirkning) ||
    (filters.isAktivitetskravChecked &&
      personData.aktivitetskravvurdering !== null) ||
    (filters.isAktivitetskravVurderStansChecked && isExpiredVarsel)
  );
}

export function filterHendelser(
  personregister: PersonregisterState,
  filter?: HendelseTypeFilter
): PersonregisterState {
  if (!filter) return personregister;

  const erTomtFilter = Object.entries(filter).every(
    ([, filterValue]) => filterValue === false
  );

  if (erTomtFilter) {
    return personregister;
  }

  const filtered = Object.entries(personregister).filter(([, personData]) => {
    return isPersonVisible(filter, personData);
  });

  return Object.fromEntries(filtered);
}

export function filterEventsOnVeileder(
  personregister: PersonregisterState,
  veilederIdenter: string[]
): PersonregisterState {
  if (!veilederIdenter.length) return personregister;
  const filtered = Object.entries(
    personregister
  ).filter(([, { tildeltVeilederIdent }]) =>
    veilederIdenter.some((ident) => ident === tildeltVeilederIdent)
  );
  return Object.fromEntries(filtered);
}

export function getSortedEventsFromSortingType(
  personregister: PersonregisterState,
  veiledere: VeilederDTO[],
  { direction, orderBy }: Sorting
): PersonregisterState {
  switch (orderBy) {
    case 'NAME':
      return sortEventsOnName(personregister, direction);
    case 'FNR':
      return sortEventsOnFnr(personregister, direction);
    case 'COMPANY':
      return sortEventsOnCompanyName(personregister, direction);
    case 'VEILEDER':
      return sortEventsOnVeileder(personregister, veiledere, direction);
    case 'UKE':
      return sortEventsOnTilfelleVarighet(personregister, direction);
    case 'DATO':
      return sortEventsOnFrist(personregister, direction);
    case 'HENDELSE':
      return sortEventsOnStatus(personregister, direction);
    case 'NONE':
      return personregister;
  }
}

function sortVeiledereByLastName(
  persondataA: PersonData,
  persondataB: PersonData,
  veiledere: VeilederDTO[],
  direction: SortDirection
) {
  const veilederA = veiledere.find(
    (v) => persondataA.tildeltVeilederIdent === v.ident
  );
  const veilederB = veiledere.find(
    (v) => persondataB.tildeltVeilederIdent === v.ident
  );

  const lastNameA = veilederA?.etternavn || '';
  const lastNameB = veilederB?.etternavn || '';

  if (lastNameA > lastNameB) return direction === 'ascending' ? -1 : 1;
  if (lastNameA < lastNameB) return direction === 'ascending' ? 1 : -1;
  return 0;
}

function sortEventsOnVeileder(
  personregister: PersonregisterState,
  veiledere: VeilederDTO[],
  direction: SortDirection
): PersonregisterState {
  const sorted = Object.entries(personregister).sort(
    ([, persondataA], [, persondataB]) => {
      return sortVeiledereByLastName(
        persondataA,
        persondataB,
        veiledere,
        direction
      );
    }
  );

  return Object.fromEntries(sorted);
}

function sortEventsOnCompanyName(
  personregister: PersonregisterState,
  direction: SortDirection
): PersonregisterState {
  const sorted = Object.entries(personregister).sort(
    ([, persondataA], [, persondataB]) => {
      const companyNameA = firstCompanyNameFromPersonData(persondataA) || '';
      const companyNameB = firstCompanyNameFromPersonData(persondataB) || '';
      if (companyNameA > companyNameB)
        return direction === 'ascending' ? -1 : 1;
      if (companyNameA < companyNameB)
        return direction === 'ascending' ? 1 : -1;
      return 0;
    }
  );

  return Object.fromEntries(sorted);
}

function sortEventsOnFnr(
  personregister: PersonregisterState,
  direction: SortDirection
): PersonregisterState {
  const sorted = Object.entries(personregister).sort(([fnrA], [fnrB]) => {
    const birthDateA = Number(fnrA.slice(0, 4));
    const birthDateB = Number(fnrB.slice(0, 4));
    if (birthDateB === birthDateA) return 0;
    if (direction === 'ascending') {
      if (birthDateA > birthDateB) return 1;
      return -1;
    } else if (direction === 'descending') {
      if (birthDateA < birthDateB) return 1;
      return -1;
    }
    return 0;
  });

  return Object.fromEntries(sorted);
}

function sortEventsOnName(
  personregister: PersonregisterState,
  direction: SortDirection
): PersonregisterState {
  const sorted = Object.entries(personregister).sort(
    ([, persondataA], [, persondataB]) => {
      const lastNameA = persondataA.navn.split(' ').pop() || '';
      const lastNameB = persondataB.navn.split(' ').pop() || '';

      return lastNameA.localeCompare(lastNameB);
    }
  );

  return direction === 'ascending'
    ? Object.fromEntries(sorted)
    : Object.fromEntries(sorted.reverse());
}

function sortEventsOnStatus(
  personregister: PersonregisterState,
  direction: SortDirection
): PersonregisterState {
  const sorted = Object.entries(personregister).sort(
    ([, persondataA], [, persondataB]) => {
      const statusA = getHendelser(persondataA)[0] || '';
      const statusB = getHendelser(persondataB)[0] || '';

      return statusA.localeCompare(statusB);
    }
  );

  return direction === 'ascending'
    ? Object.fromEntries(sorted)
    : Object.fromEntries(sorted.reverse());
}

function sortEventsOnTilfelleVarighet(
  personregister: PersonregisterState,
  direction: SortDirection
): PersonregisterState {
  const sorted = Object.entries(personregister).sort(
    ([, persondataA], [, persondataB]) => {
      const varighetA = persondataA.latestOppfolgingstilfelle?.varighetUker;
      const varighetB = persondataB.latestOppfolgingstilfelle?.varighetUker;
      if (!varighetA) return direction === 'ascending' ? -1 : 1;
      if (!varighetB) return direction === 'ascending' ? 1 : -1;
      const compareVarighet =
        direction === 'ascending'
          ? varighetA - varighetB
          : varighetB - varighetA;
      return compareVarighet === 0
        ? compareTilfelleStart(persondataA, persondataB, direction)
        : compareVarighet;
    }
  );

  return Object.fromEntries(sorted);
}

function compareTilfelleStart(
  persondataA: PersonData,
  persondataB: PersonData,
  direction: SortDirection
) {
  const startDateA =
    persondataA.latestOppfolgingstilfelle?.oppfolgingstilfelleStart;
  const startDateB =
    persondataB.latestOppfolgingstilfelle?.oppfolgingstilfelleStart;
  if (!startDateA) return direction === 'ascending' ? -1 : 1;
  if (!startDateB) return direction === 'ascending' ? 1 : -1;
  if (startDateA > startDateB) return direction === 'ascending' ? -1 : 1;
  if (startDateA < startDateB) return direction === 'ascending' ? 1 : -1;
  return 0;
}

function sortEventsOnFrist(
  personregister: PersonregisterState,
  direction: SortDirection
): PersonregisterState {
  const sorted = Object.entries(personregister).sort(
    ([, persondataA], [, persondataB]) => {
      const fristDateA =
        direction === 'ascending'
          ? getEarliestFrist(persondataA)
          : getLatestFrist(persondataA);
      const fristDateB =
        direction === 'ascending'
          ? getEarliestFrist(persondataB)
          : getLatestFrist(persondataB);
      if (!fristDateA) return direction === 'ascending' ? 1 : -1;
      if (!fristDateB) return direction === 'ascending' ? -1 : 1;
      if (fristDateA > fristDateB) return direction === 'ascending' ? 1 : -1;
      if (fristDateA < fristDateB) return direction === 'ascending' ? -1 : 1;
      return 0;
    }
  );

  return Object.fromEntries(sorted);
}
