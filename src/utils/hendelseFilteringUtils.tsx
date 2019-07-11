import { PersonregisterState } from '../store/personregister/personregisterTypes';
import { HendelseTypeFilters } from '../components/HendelseTypeFilter';
import { isNullOrUndefined } from 'util';

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
            } else if (filter.svartMote && personData.harMote) {
                cv[fnr] = personData;
            } else if (filter.ufordeltBruker && isNullOrUndefined(personData.tildeltVeilederIdent)) {
                cv[fnr] = personData;
            }
            return cv;
        }, {} as PersonregisterState);
    return nyttFiltrertPersonregister;
  };
