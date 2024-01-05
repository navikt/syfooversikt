import {
  PersonData,
  PersonregisterState,
} from '@/api/types/personregisterTypes';
import {
  firstCompanyNameFromPersonData,
  getEarliestFrist,
  getLatestFrist,
} from './personDataUtil';
import { Veileder } from '@/api/types/veiledereTypes';
import { HendelseTypeFilters } from '@/context/filters/filterContextState';
import { isFuture, isPast, isToday } from '@/utils/dateUtils';

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
    const aktivitetskravVurderingFrist =
      persondata.aktivitetskravVurderingFrist;
    const oppfolgingsoppgaveFrist = persondata.trengerOppfolgingFrist;
    if (
      aktivitetskravVurderingFrist === null &&
      oppfolgingsoppgaveFrist === null
    ) {
      return true;
    }
    const isOppfolgingsoppgaveVisible = oppfolgingsoppgaveFrist
      ? isInFristFilter(selectedFristFilters, oppfolgingsoppgaveFrist)
      : false;
    const isAktivitetskravVisible = aktivitetskravVurderingFrist
      ? isInFristFilter(selectedFristFilters, aktivitetskravVurderingFrist)
      : false;
    return isOppfolgingsoppgaveVisible || isAktivitetskravVisible;
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
    case 'aktivitetskrav':
      return !filters[key] || personData.aktivitetskravActive;
    case 'behandlerdialog':
      return !filters[key] || personData.harBehandlerdialogUbehandlet;
    case 'aktivitetskravVurderStans':
      return !filters[key] || personData.harAktivitetskravVurderStansUbehandlet;
    case 'huskelapp':
      return !filters[key] || personData.trengerOppfolging;
    case 'behandlerBerOmBistand':
      return !filters[key] || personData.behandlerBerOmBistandUbehandlet;
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

export type SortingType =
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'FNR_ASC'
  | 'FNR_DESC'
  | 'COMPANY_ASC'
  | 'COMPANY_DESC'
  | 'VEILEDER_ASC'
  | 'VEILEDER_DESC'
  | 'UKE_ASC'
  | 'UKE_DESC'
  | 'DATO_ASC'
  | 'DATO_DESC'
  | 'NONE';

export const getSortedEventsFromSortingType = (
  personregister: PersonregisterState,
  veiledere: Veileder[],
  type: SortingType
): PersonregisterState => {
  switch (type) {
    case 'NAME_ASC':
    case 'NAME_DESC':
      return sortEventsOnName(personregister, type);
    case 'FNR_ASC':
    case 'FNR_DESC':
      return sortEventsOnFnr(personregister, type);
    case 'COMPANY_ASC':
    case 'COMPANY_DESC':
      return sortEventsOnCompanyName(personregister, type);
    case 'VEILEDER_ASC':
    case 'VEILEDER_DESC':
      return sortEventsOnVeileder(personregister, veiledere, type);
    case 'UKE_ASC':
    case 'UKE_DESC':
      return sortEventsOnTilfelleVarighet(personregister, type);
    case 'DATO_ASC':
    case 'DATO_DESC':
      return sortEventsOnFrist(personregister, type);
    case 'NONE':
      return personregister;
  }
};

const sortVeiledereByLastName = (
  persondataA: PersonData,
  persondataB: PersonData,
  veiledere: Veileder[],
  order: SortingType
) => {
  const veilederA = veiledere.find(
    (v) => persondataA.tildeltVeilederIdent === v.ident
  );
  const veilederB = veiledere.find(
    (v) => persondataB.tildeltVeilederIdent === v.ident
  );

  const lastNameA = veilederA?.etternavn || '';
  const lastNameB = veilederB?.etternavn || '';

  if (lastNameA > lastNameB) return order === 'VEILEDER_ASC' ? -1 : 1;
  if (lastNameA < lastNameB) return order === 'VEILEDER_ASC' ? 1 : -1;
  return 0;
};

const sortEventsOnVeileder = (
  personregister: PersonregisterState,
  veiledere: Veileder[],
  order: SortingType
): PersonregisterState => {
  const sorted = Object.entries(personregister).sort(
    ([, persondataA], [, persondataB]) => {
      return sortVeiledereByLastName(
        persondataA,
        persondataB,
        veiledere,
        order
      );
    }
  );

  return Object.fromEntries(sorted);
};

const sortEventsOnCompanyName = (
  personregister: PersonregisterState,
  order: SortingType
): PersonregisterState => {
  const sorted = Object.entries(personregister).sort(
    ([, persondataA], [, persondataB]) => {
      const companyNameA = firstCompanyNameFromPersonData(persondataA) || '';
      const companyNameB = firstCompanyNameFromPersonData(persondataB) || '';
      if (companyNameA > companyNameB) return order === 'COMPANY_ASC' ? -1 : 1;
      if (companyNameA < companyNameB) return order === 'COMPANY_ASC' ? 1 : -1;
      return 0;
    }
  );

  return Object.fromEntries(sorted);
};

const sortEventsOnFnr = (
  personregister: PersonregisterState,
  order: SortingType
): PersonregisterState => {
  const sorted = Object.entries(personregister).sort(([fnrA], [fnrB]) => {
    const birthDateA = Number(fnrA.slice(0, 2));
    const birthDateB = Number(fnrB.slice(0, 2));
    if (birthDateB === birthDateA) return 0;
    if (order === 'FNR_ASC') {
      if (birthDateA > birthDateB) return 1;
      return -1;
    } else if (order === 'FNR_DESC') {
      if (birthDateA < birthDateB) return 1;
      return -1;
    }
    return 0;
  });

  return Object.fromEntries(sorted);
};

const sortEventsOnName = (
  personregister: PersonregisterState,
  order: SortingType
): PersonregisterState => {
  const sorted = Object.entries(personregister).sort(
    ([, persondataA], [, persondataB]) => {
      const lastNameA = persondataA.navn.split(' ').pop() || '';
      const lastNameB = persondataB.navn.split(' ').pop() || '';

      return lastNameA.localeCompare(lastNameB);
    }
  );

  return order === 'NAME_ASC'
    ? Object.fromEntries(sorted)
    : Object.fromEntries(sorted.reverse());
};

const sortEventsOnTilfelleVarighet = (
  personregister: PersonregisterState,
  order: SortingType
): PersonregisterState => {
  const sorted = Object.entries(personregister).sort(
    ([, persondataA], [, persondataB]) => {
      const varighetA = persondataA.latestOppfolgingstilfelle?.varighetUker;
      const varighetB = persondataB.latestOppfolgingstilfelle?.varighetUker;
      if (!varighetA) return order === 'UKE_ASC' ? -1 : 1;
      if (!varighetB) return order === 'UKE_ASC' ? 1 : -1;
      const compareVarighet =
        order === 'UKE_ASC' ? varighetA - varighetB : varighetB - varighetA;
      return compareVarighet === 0
        ? compareTilfelleStart(persondataA, persondataB, order)
        : compareVarighet;
    }
  );

  return Object.fromEntries(sorted);
};

const compareTilfelleStart = (
  persondataA: PersonData,
  persondataB: PersonData,
  order: SortingType
) => {
  const startDateA =
    persondataA.latestOppfolgingstilfelle?.oppfolgingstilfelleStart;
  const startDateB =
    persondataB.latestOppfolgingstilfelle?.oppfolgingstilfelleStart;
  if (!startDateA) return order === 'UKE_ASC' ? -1 : 1;
  if (!startDateB) return order === 'UKE_ASC' ? 1 : -1;
  if (startDateA > startDateB) return order === 'UKE_ASC' ? -1 : 1;
  if (startDateA < startDateB) return order === 'UKE_ASC' ? 1 : -1;
  return 0;
};

const sortEventsOnFrist = (
  personregister: PersonregisterState,
  order: 'DATO_ASC' | 'DATO_DESC'
): PersonregisterState => {
  const sorted = Object.entries(personregister).sort(
    ([, persondataA], [, persondataB]) => {
      const fristDateA =
        order === 'DATO_ASC'
          ? getEarliestFrist(persondataA)
          : getLatestFrist(persondataA);
      const fristDateB =
        order === 'DATO_ASC'
          ? getEarliestFrist(persondataB)
          : getLatestFrist(persondataB);
      if (!fristDateA) return order === 'DATO_ASC' ? 1 : -1;
      if (!fristDateB) return order === 'DATO_ASC' ? -1 : 1;
      if (fristDateA > fristDateB) return order === 'DATO_ASC' ? 1 : -1;
      if (fristDateA < fristDateB) return order === 'DATO_ASC' ? -1 : 1;
      return 0;
    }
  );

  return Object.fromEntries(sorted);
};
