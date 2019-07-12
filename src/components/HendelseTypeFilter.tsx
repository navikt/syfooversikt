import React, { useState, ComponentPropsWithoutRef } from 'react';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox } from 'nav-frontend-skjema';

const HendelseTekster: any = {
    MOTEBEHOV: 'Ønsker møte', // MØTEBEHOV - UBEHANDLET
    MOTEPLANLEGGER_SVAR: 'Svar møteplanlegger', // Svar fra møteplanlegger
    UFORDELTE_BRUKERE: 'Ufordelte brukere', // Ikke tildelt veileder
};

interface Props extends ComponentPropsWithoutRef<any> {
    onFilterChange: (filter: HendelseTypeFilters) => void;
}

export interface HendelseTypeFilters {
    onskerMote: boolean;
    svartMote: boolean;
    ufordeltBruker: boolean;
}

const lagNyttFilter = (forrigeFilter: HendelseTypeFilters, tekst: string, checked: boolean) => {
    const filter = {...forrigeFilter};
    if (tekst === HendelseTekster.MOTEBEHOV) filter.onskerMote = checked;
    if (tekst === HendelseTekster.MOTEPLANLEGGER_SVAR) filter.svartMote = checked;
    if (tekst === HendelseTekster.UFORDELTE_BRUKERE) filter.ufordeltBruker = checked;
    return filter;
};

interface CheckboksElement {
    tekst: string;
    key: string;
}

export default ({ onFilterChange: onValgteElementerChange, className }: Props) => {

    const initialFilter: HendelseTypeFilters = {
        onskerMote: false,
        svartMote: false,
        ufordeltBruker: false,
    };
    const [ filter, setFilter ] = useState<HendelseTypeFilters>(initialFilter);

    const elementer = Object.keys(HendelseTekster).map((key) => {
        const tekst: string = HendelseTekster[key];
        return { key, tekst } as CheckboksElement;
    });

    const onCheckedChange = (element: CheckboksElement, checked: boolean) => {
        const nyttFilter = lagNyttFilter(filter, element.tekst, checked);
        setFilter(nyttFilter);
        onValgteElementerChange(nyttFilter);
    };

    return (
            <div className={...className}>
                <EkspanderbartPanel apen tittel="Hendelse">
                    <div>
                        {genererHendelseCheckbokser(elementer, onCheckedChange)}
                    </div>
                </EkspanderbartPanel>
            </div>
    );
};

const genererHendelseCheckbokser = (elementer: CheckboksElement[], onCheckedChange: (klikketElement: CheckboksElement, checked: boolean) => void) => (
    elementer.map((k) => {
        return <Checkbox label={k.tekst} id={k.key} key={k.key} onChange={(e) => onCheckedChange(k, e.target.checked)} />;
    })
);
