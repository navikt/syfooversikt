import {
  PersonData,
  PersonregisterState,
} from '@/api/types/personregisterTypes';
import { firstCompanyNameFromPersonData } from './personDataUtil';
import { Veileder } from '@/api/types/veiledereTypes';
import { formaterNavn } from './lenkeUtil';
import { HendelseTypeFilters } from '@/context/filters/filterContextState';

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
    if (filter.onskerMote && personData.harMotebehovUbehandlet) {
      return true;
    } else if (
      filter.arbeidsgiverOnskerMote &&
      personData.harOppfolgingsplanLPSBistandUbehandlet
    ) {
      return true;
    } else if (filter.dialogmotekandidat && personData.dialogmotekandidat) {
      return true;
    } else if (filter.ufordeltBruker && !personData.tildeltVeilederIdent) {
      return true;
    } else if (filter.dialogmotesvar && personData.harDialogmotesvar) {
      return true;
    }
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
  | 'NONE';

export const getSortedEventsFromSortingType = (
  personregister: PersonregisterState,
  veiledere: Veileder[],
  type: SortingType
): PersonregisterState => {
  if (type === 'NAME_ASC' || type === 'NAME_DESC') {
    return sortEventsOnName(personregister, type);
  } else if (type === 'FNR_ASC' || type === 'FNR_DESC') {
    return sortEventsOnFnr(personregister, type);
  } else if (type === 'COMPANY_ASC' || type === 'COMPANY_DESC') {
    return sortEventsOnCompanyName(personregister, type);
  } else if (type === 'VEILEDER_ASC' || type === 'VEILEDER_DESC') {
    return sortEventsOnVeileder(personregister, veiledere, type);
  }
  return personregister;
};

const sortEventsOnVeileder = (
  personregister: PersonregisterState,
  veiledere: Veileder[],
  order: SortingType
): PersonregisterState => {
  const sorted = Object.entries(personregister).sort(
    ([, persondataA], [, persondataB]) => {
      const veilederIdentA =
        veiledere.find((v) => persondataA.tildeltVeilederIdent === v.ident) ||
        '';
      const veilederIdentB =
        veiledere.find((v) => persondataB.tildeltVeilederIdent === v.ident) ||
        '';
      if (veilederIdentA > veilederIdentB)
        return order === 'VEILEDER_ASC' ? -1 : 1;
      if (veilederIdentA < veilederIdentB)
        return order === 'VEILEDER_ASC' ? 1 : -1;
      return 0;
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
      const lastNameA = formaterNavn(persondataA.navn).split(',').shift() || '';
      const lastNameB = formaterNavn(persondataB.navn).split(',').shift() || '';
      return lastNameA.localeCompare(lastNameB);
    }
  );

  return order === 'NAME_ASC'
    ? Object.fromEntries(sorted)
    : Object.fromEntries(sorted.reverse());
};
