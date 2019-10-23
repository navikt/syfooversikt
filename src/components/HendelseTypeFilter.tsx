import React, { ComponentPropsWithoutRef, useEffect } from 'react';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import countFilterAction from '../metrics/countFilterAction';
import { PersonregisterState } from '../store/personregister/personregisterTypes';
import { filtrerPersonregister } from '../utils/hendelseFilteringUtils';
import { ApplicationState } from '../store';
import { HendelseTypeFilters } from '../store/filters/filterReducer';
import { updateHendelseFilterAction } from '../store/filters/filter_actions';
import { OverviewTabType } from '../konstanter';

export const HendelseTekster: any = {
    UFORDELTE_BRUKERE: 'Ufordelte brukere', // Ikke tildelt veileder
    MOTEBEHOV: 'Ønsker møte', // MØTEBEHOV - UBEHANDLET
    MOTEPLANLEGGER_SVAR: 'Svar møteplanlegger', // Svar fra møteplanlegger
    IKKE_I_AKTIVITET: '100% f.o.m. 8 uker',
};

interface Props extends ComponentPropsWithoutRef<any> {
    onFilterChange: (filter: HendelseTypeFilters) => void;
    personRegister?: PersonregisterState;
}

const enkeltFilterFraTekst = (tekst: string, checked: boolean): HendelseTypeFilters => {
    const filter: HendelseTypeFilters = {
        onskerMote: false,
        svartMote: false,
        ufordeltBruker: false,
        ikkeIAktivitet: false,
    };
    return lagNyttFilter(filter, tekst, checked);
};

const lagNyttFilter = (forrigeFilter: HendelseTypeFilters, tekst: string, checked: boolean): HendelseTypeFilters => {
    const filter = { ...forrigeFilter };
    if (tekst === HendelseTekster.MOTEBEHOV) filter.onskerMote = checked;
    if (tekst === HendelseTekster.MOTEPLANLEGGER_SVAR) filter.svartMote = checked;
    if (tekst === HendelseTekster.UFORDELTE_BRUKERE) filter.ufordeltBruker = checked;
    if (tekst === HendelseTekster.IKKE_I_AKTIVITET) filter.ikkeIAktivitet = checked;
    return filter;
};

const isCheckedInState = (state: HendelseTypeFilters, tekst: string): boolean => {
    if (tekst === HendelseTekster.MOTEBEHOV) return state.onskerMote;
    if (tekst === HendelseTekster.MOTEPLANLEGGER_SVAR) return state.svartMote;
    if (tekst === HendelseTekster.UFORDELTE_BRUKERE) return state.ufordeltBruker;
    if (tekst === HendelseTekster.IKKE_I_AKTIVITET) return state.ikkeIAktivitet;
    return false;
};

interface CheckboksElement {
    tekst: string;
    checked: boolean;
    key: string;
    tabType: OverviewTabType;
}

export default ({ className, personRegister, tabType }: Props) => {

    const dispatch = useDispatch();
    const currentHendelseFilters = useSelector((state: ApplicationState) => state.filters.selectedHendelseType);

    const updateHendelseFilterState = (filters: HendelseTypeFilters) => {
        dispatch(updateHendelseFilterAction(filters));
    };

    const elementer = Object.keys(HendelseTekster).filter((key) => {
        if (HendelseTekster[key] === HendelseTekster.UFORDELTE_BRUKERE && tabType === OverviewTabType.MY_OVERVIEW) {
            return false;
        }
        return true;
    }).map((key) => {
        const tekst: string = HendelseTekster[key];
        const checked = isCheckedInState(currentHendelseFilters, tekst);
        return { key, tekst, checked } as CheckboksElement;
    });

    const onCheckedChange = (element: CheckboksElement, checked: boolean) => {
        const nyttFilter = lagNyttFilter(currentHendelseFilters, element.tekst, checked);
        updateHendelseFilterState(nyttFilter);
        if (checked) {
            countFilterAction(element.tekst).next();
        }
    };

    return (
        <div className={...className}>
            <EkspanderbartPanel apen tittel="Hendelse">
                <div>
                    {genererHendelseCheckbokser(elementer, onCheckedChange, personRegister)}
                </div>
            </EkspanderbartPanel>
        </div>
    );
};

const genererHendelseCheckbokser = (
    elementer: CheckboksElement[],
    onCheckedChange: (klikketElement: CheckboksElement, checked: boolean) => void,
    personRegister?: PersonregisterState) => {
    return elementer.map((checkboksElement) => {
        const filter = enkeltFilterFraTekst(checkboksElement.tekst, true);
        const antall = Object.keys(filtrerPersonregister(personRegister || {}, filter)).length;
        const labelNode = (<div>{checkboksElement.tekst} <strong>({antall})</strong></div>);
        return (<Checkbox
            label={labelNode}
            checked={checkboksElement.checked}
            id={checkboksElement.key}
            key={checkboksElement.key}
            onChange={(e) => onCheckedChange(checkboksElement, e.target.checked)}
        />);
    });
};
