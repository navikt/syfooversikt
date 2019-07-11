import { PersonregisterState } from '../store/personregister/personregisterTypes';
import { HendelseTypeFilters } from '../components/HendelseTypeFilter';
import { isNullOrUndefined } from 'util';

export class Filterable<T> {

    value: T;

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    applyFilter(filter: (currentValue: T) => T): Filterable<T> {
        return new Filterable<T>(filter(this.value));
    }
}

// type Filterable<T> = (arg: T) => Filterable<T>;

export const filtrerPaaFodelsnummerEllerNavn = (personregister: PersonregisterState, sok: string): PersonregisterState => {
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
