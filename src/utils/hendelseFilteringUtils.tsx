import { PersonregisterState, PersonData } from '../store/personregister/personregisterTypes';
import { HendelseTypeFilters } from '../components/HendelseTypeFilter';
import { isNullOrUndefined } from 'util';
import { formaterNavn } from './lenkeUtil';

export class Filterable<T> {

    value: T;

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    applyFilter(filter: (currentValue: T) => T): Filterable<T> {
        return new Filterable<T>(filter(this.value));
    }
}

export const filtrerPaaFodselsnummerEllerNavn = (personregister: PersonregisterState, sok: string): PersonregisterState => {
    if (sok.length === 0) {
        return personregister;
    }
    return Object.keys(personregister).reduce((cv, fnr) => {
        const pd = personregister[fnr];
        if (fnr.toLowerCase().indexOf(sok.toLowerCase()) > -1) {
            cv[fnr] = personregister[fnr];
        } else if (pd.navn.toLowerCase().indexOf(sok.toLocaleLowerCase()) > -1) {
            cv[fnr] = personregister[fnr];
        }
        return cv;
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
            }
            return cv;
        }, {} as PersonregisterState);
    return nyttFiltrertPersonregister;
  };

export const filterEventsOnVeileder = (personregister: PersonregisterState, veilederIdent: string): PersonregisterState => {
    const final = Object.keys(personregister).reduce((p, fnr) => {
        if (personregister[fnr].tildeltVeilederIdent === veilederIdent) {
            p[fnr] = personregister[fnr];
        }
        return p;
    }, {} as PersonregisterState);
    return final;
};

export type SortingType = 'NAME_ASC' | 'NAME_DESC' | 'NONE';

export const getSortedEventsFromSortingType = (personregister: PersonregisterState, type: SortingType) => {
    if (type === 'NAME_DESC') {
        return sortEventsOnName(personregister, 'NAME_DESC');
    } else if (type === 'NAME_ASC') {
        return sortEventsOnName(personregister, 'NAME_ASC');
    }
    return personregister;
};

export const sortEventsOnName = (personregister: PersonregisterState, order: SortingType): PersonregisterState => {
    const sortingResultAsArray = Object.keys(personregister).reduce((currentState, fnr) => {
        if (personregister[fnr]) {
            currentState.push({...personregister[fnr], fnr });
        }
        return currentState;
    }, [] as any[]);
    const sortedArray = sortingResultAsArray.sort((a, b) => {
        if (a && b) {
            const lastNameA: string = formaterNavn(a.navn).split(',').shift() || '';
            const lastNameB: string = formaterNavn(b.navn).split(',').shift() || '';
            if (lastNameA > lastNameB) return order === 'NAME_ASC' ? -1 : 1;
            if (lastNameA < lastNameB) return order === 'NAME_ASC' ? 1 : -1;
        }
        return 0;
    });
    const finalMap = sortedArray.reduce((current, value) => {
        current[value.fnr] = value;
        return current;
    }, {} as PersonregisterState);
    return finalMap;
};
