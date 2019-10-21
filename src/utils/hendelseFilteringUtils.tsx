import {
    PersonregisterState,
    PersonData
} from '../store/personregister/personregisterTypes';
import { isNullOrUndefined } from 'util';
import { formaterNavn } from './lenkeUtil';
import { HendelseTypeFilters } from '../store/filters/filterReducer';

export class Filterable<T> {

    value: T;

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    applyFilter(filter: (currentValue: T) => T): Filterable<T> {
        return new Filterable<T>(filter(this.value));
    }
}

const getAllFnrFromPersonregister = (personregister: PersonregisterState) => Object.keys(personregister);

const hasCompany = (personData: PersonData) => personData && personData.oppfolgingstilfeller && personData.oppfolgingstilfeller.length;

export const filtrerPaaFodselsnummerEllerNavn = (personregister: PersonregisterState, sok: string): PersonregisterState => {
    if (sok.length === 0) {
        return personregister;
    }
    return Object.keys(personregister).reduce((cv, fnr) => {
        const pd = personregister[fnr];
        if (fnr.toLowerCase().indexOf(sok.toLowerCase()) > -1) {
            cv[fnr] = personregister[fnr];
        } else if (pd.navn && pd.navn.toLowerCase().indexOf(sok.toLocaleLowerCase()) > -1) {
            cv[fnr] = personregister[fnr];
        }
        return cv;
    }, {} as PersonregisterState);
};

const getBirthDateFromFnr = (fnr: string): string => fnr.slice(0, 2);

export const filterOnCompany = (personregister: PersonregisterState, companies: string[]) => {
    if (!companies || companies.length === 0) {
        return personregister;
    }
    return getAllFnrFromPersonregister(personregister).filter((fnr) => {
        return hasCompany(personregister[fnr]);
    })
    .filter((fnr) => {
        const personData = personregister[fnr];
        return personData
            .oppfolgingstilfeller
            .filter((oppfolgingstilfelle) => companies.indexOf(oppfolgingstilfelle.virksomhetsnavn) !== -1)
            .length > 0;
    })
    .reduce((filteredRegister, fnr) => {
        filteredRegister[fnr] = personregister[fnr];
        return filteredRegister;
    }, {} as PersonregisterState);
};

export const filterOnBirthDates = (personregister: PersonregisterState, birthDates: string[]): PersonregisterState => {
    if (birthDates.length === 0) return personregister;
    return Object.keys(personregister)
        .filter((fnr) => {
            const birthDate = getBirthDateFromFnr(fnr);
            return birthDates.indexOf(birthDate) !== -1;
        })
        .reduce((newPersonRegister, fnr) => {
            newPersonRegister[fnr] = personregister[fnr];
            return newPersonRegister;
        }, {} as PersonregisterState);
};

export const filterOnEnhet = (personregister: PersonregisterState, enhetId: string): PersonregisterState => {
    return Object.keys(personregister).reduce((person, fnr) => {
        if (personregister[fnr].tildeltEnhetId === enhetId) {
            person[fnr] = personregister[fnr];
        }
        return person;
    }, {} as PersonregisterState);
};

export const filtrerPersonregister = (personregister: PersonregisterState, filter?: HendelseTypeFilters): PersonregisterState => {
    if (!filter) return personregister;

    const erTomtFilter = Object
        .keys(filter)
        .filter((key) => ((filter as any)[key] === true))
        .length === 0;

    const nyttFiltrertPersonregister = erTomtFilter
        ? personregister
        : Object.keys(personregister).reduce((cv, fnr) => {
            const personData = personregister[fnr];
            if (filter.onskerMote && personData.harMotebehovUbehandlet) {
                cv[fnr] = personData;
            } else if (filter.svartMote && personData.harMoteplanleggerUbehandlet) {
                cv[fnr] = personData;
            } else if (filter.ufordeltBruker && isNullOrUndefined(personData.tildeltVeilederIdent)) {
                cv[fnr] = personData;
            } else if (filter.ikkeIAktivitet && personData.oppfolgingstilfeller && personData.oppfolgingstilfeller.length > 0) {
                cv[fnr] = personData;
            }
            return cv;
        }, {} as PersonregisterState);
    return nyttFiltrertPersonregister;
  };

export const filterEventsOnVeileder = (personregister: PersonregisterState, veilederIdenter: string[]): PersonregisterState => {
    if (!veilederIdenter.length) return personregister;
    const final = Object.keys(personregister).reduce((p, fnr) => {
        if (veilederIdenter.find((v) => v === personregister[fnr].tildeltVeilederIdent)) {
            p[fnr] = personregister[fnr];
        }
        return p;
    }, {} as PersonregisterState);
    return final;
};

export type SortingType = 'NAME_ASC' | 'NAME_DESC' | 'FNR_ASC' | 'FNR_DESC' | 'NONE';

export const getSortedEventsFromSortingType = (personregister: PersonregisterState, type: SortingType) => {
    if (type === 'NAME_ASC' || type === 'NAME_DESC') {
        return sortEventsOnName(personregister, type);
    } else if (type === 'FNR_ASC' || type === 'FNR_DESC') {
        return sortEventsOnFnr(personregister, type);
    }
    return personregister;
};

const sortEventsOnFnr = (personregister: PersonregisterState, order: SortingType) => {
    const fnrArray = Object.keys(personregister);

    const sortedFnrArray = fnrArray.sort((a, b) => {
        const birthDateA = Number(a.slice(0, 2));
        const birthDateB = Number(b.slice(0, 2));
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

    return sortedFnrArray.reduce((currentMap, currentFnr) => {
        currentMap[currentFnr] = personregister[currentFnr];
        return currentMap;
    }, {} as PersonregisterState);
};

const sortEventsOnName = (personregister: PersonregisterState, order: SortingType): PersonregisterState => {
    const personRegisterAsArray = Object.keys(personregister).reduce((currentPersonregisterArray, fnr) => {
        if (personregister[fnr]) {
            currentPersonregisterArray.push({...personregister[fnr], fnr });
        }
        return currentPersonregisterArray;
    }, [] as any[]);
    const sortedPersonRegisterArray = personRegisterAsArray.sort((a, b) => {
        if (a && b) {
            const lastNameA: string = formaterNavn(a.navn).split(',').shift() || '';
            const lastNameB: string = formaterNavn(b.navn).split(',').shift() || '';
            if (lastNameA > lastNameB) return order === 'NAME_ASC' ? -1 : 1;
            if (lastNameA < lastNameB) return order === 'NAME_ASC' ? 1 : -1;
        }
        return 0;
    });
    const sortedRegisterAsMap = sortedPersonRegisterArray.reduce((personregisterMap, value) => {
        personregisterMap[value.fnr] = value;
        return personregisterMap;
    }, {} as PersonregisterState);
    return sortedRegisterAsMap;
};
