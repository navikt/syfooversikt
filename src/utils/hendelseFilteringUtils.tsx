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
import { HendelseTypeFilters } from '@/context/filters/filterContextState';
import { isFuture, isPast, isToday } from '@/utils/dateUtils';
import { SortDirection, Sorting } from '@/hooks/useSorting';
import { getHendelser } from './statusColumnUtils';

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

export const filterOnFodselsnummerOrName = (
  personregister: PersonregisterState,
  sok: string
): PersonregisterState => {
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
};

const getBirthDateFromFnr = (fnr: string): string => fnr.slice(0, 2);

export const filterOnCompany = (
  personregister: PersonregisterState,
  companies: string[]
): PersonregisterState => {
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
};

export const filterOnBirthDates = (
  personregister: PersonregisterState,
  birthDates: string[]
): PersonregisterState => {
  if (birthDates.length === 0) return personregister;

  const filtered = Object.entries(personregister).filter(([fnr]) => {
    const birthDate = getBirthDateFromFnr(fnr);
    return birthDates.indexOf(birthDate) !== -1;
  });

  return Object.fromEntries(filtered);
};

export enum FristFilterOption {
  Past = 'Past',
  Today = 'Today',
  Future = 'Future',
}

export const filterOnFrist = (
  personregister: PersonregisterState,
  selectedFristFilters: FristFilterOption[]
): PersonregisterState => {
  const isNoFilter = selectedFristFilters.length === 0;
  if (isNoFilter) {
    return personregister;
  }
  const filtered = Object.entries(personregister).filter(([, persondata]) => {
    const frister = [
      persondata.arbeidsuforhetvurdering?.varsel?.svarfrist,
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
};

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
  ThirtyAndUnder = 'ThirtyAndUnder',
  OverThirty = 'OverThirty',
}

export const filterOnAge = (
  personregister: PersonregisterState,
  selectedAgeFilters: AgeFilterOption[]
): PersonregisterState => {
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
};

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
      case AgeFilterOption.ThirtyAndUnder:
        return age <= 30;
      case AgeFilterOption.OverThirty:
        return age > 30;
    }
  });
}

type HendelseTypeFilterKey = keyof HendelseTypeFilters;

const matchesFilter = (
  key: HendelseTypeFilterKey,
  filters: HendelseTypeFilters,
  personData: PersonData
): boolean => {
  switch (key) {
    case 'onskerMote':
      return !filters[key] || personData.harMotebehovUbehandlet;
    case 'arbeidsgiverOnskerMote':
      return !filters[key] || personData.harOppfolgingsplanLPSBistandUbehandlet;
    case 'dialogmotekandidat':
      return !filters[key] || personData.dialogmotekandidat === true;
    case 'ufordeltBruker':
      return !filters[key] || !personData.tildeltVeilederIdent;
    case 'dialogmotesvar':
      return !filters[key] || personData.harDialogmotesvar;
    case 'behandlerdialog':
      return !filters[key] || personData.harBehandlerdialogUbehandlet;
    case 'oppfolgingsoppgave':
      return !filters[key] || personData.oppfolgingsoppgave !== null;
    case 'behandlerBerOmBistand':
      return !filters[key] || personData.behandlerBerOmBistandUbehandlet;
    case 'isAktivArbeidsuforhetvurdering':
      return !filters[key] || !!personData.arbeidsuforhetvurdering;
    case 'harFriskmeldingTilArbeidsformidling':
      return !filters[key] || !!personData.friskmeldingTilArbeidsformidlingFom;
    case 'isSenOppfolgingChecked':
      return !filters[key] || personData.isAktivSenOppfolgingKandidat;
    case 'isAktivManglendeMedvirkning':
      return !filters[key] || !!personData.manglendeMedvirkning;
    case 'isAktivitetskravChecked':
      return !filters[key] || personData.aktivitetskravvurdering !== null;
    case 'isAktivitetskravVurderStansChecked':
      const isExpiredVarsel =
        !!personData?.aktivitetskravvurdering?.vurderinger[0]?.varsel
          ?.svarfrist &&
        isPast(
          personData?.aktivitetskravvurdering.vurderinger[0]?.varsel?.svarfrist
        );
      return !filters[key] || isExpiredVarsel;
  }
};

export const filterOnPersonregister = (
  personregister: PersonregisterState,
  filter?: HendelseTypeFilters
): PersonregisterState => {
  if (!filter) return personregister;

  const erTomtFilter = Object.entries(filter).every(
    ([, filterValue]) => filterValue === false
  );

  if (erTomtFilter) {
    return personregister;
  }

  const filtered = Object.entries(personregister).filter(([, personData]) => {
    return Object.keys(filter).every((key) =>
      matchesFilter(key as HendelseTypeFilterKey, filter, personData)
    );
  });

  return Object.fromEntries(filtered);
};

export const filterEventsOnVeileder = (
  personregister: PersonregisterState,
  veilederIdenter: string[]
): PersonregisterState => {
  if (!veilederIdenter.length) return personregister;
  const filtered = Object.entries(
    personregister
  ).filter(([, { tildeltVeilederIdent }]) =>
    veilederIdenter.some((ident) => ident === tildeltVeilederIdent)
  );

  return Object.fromEntries(filtered);
};

export const getSortedEventsFromSortingType = (
  personregister: PersonregisterState,
  veiledere: VeilederDTO[],
  { direction, orderBy }: Sorting
): PersonregisterState => {
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
};

const sortVeiledereByLastName = (
  persondataA: PersonData,
  persondataB: PersonData,
  veiledere: VeilederDTO[],
  direction: SortDirection
) => {
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
};

const sortEventsOnVeileder = (
  personregister: PersonregisterState,
  veiledere: VeilederDTO[],
  direction: SortDirection
): PersonregisterState => {
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
};

const sortEventsOnCompanyName = (
  personregister: PersonregisterState,
  direction: SortDirection
): PersonregisterState => {
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
};

const sortEventsOnFnr = (
  personregister: PersonregisterState,
  direction: SortDirection
): PersonregisterState => {
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
};

const sortEventsOnName = (
  personregister: PersonregisterState,
  direction: SortDirection
): PersonregisterState => {
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
};

const sortEventsOnStatus = (
  personregister: PersonregisterState,
  direction: SortDirection
): PersonregisterState => {
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
};

const sortEventsOnTilfelleVarighet = (
  personregister: PersonregisterState,
  direction: SortDirection
): PersonregisterState => {
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
};

const compareTilfelleStart = (
  persondataA: PersonData,
  persondataB: PersonData,
  direction: SortDirection
) => {
  const startDateA =
    persondataA.latestOppfolgingstilfelle?.oppfolgingstilfelleStart;
  const startDateB =
    persondataB.latestOppfolgingstilfelle?.oppfolgingstilfelleStart;
  if (!startDateA) return direction === 'ascending' ? -1 : 1;
  if (!startDateB) return direction === 'ascending' ? 1 : -1;
  if (startDateA > startDateB) return direction === 'ascending' ? -1 : 1;
  if (startDateA < startDateB) return direction === 'ascending' ? 1 : -1;
  return 0;
};

const sortEventsOnFrist = (
  personregister: PersonregisterState,
  direction: SortDirection
): PersonregisterState => {
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
};
