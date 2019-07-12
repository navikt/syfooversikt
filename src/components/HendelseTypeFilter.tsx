import React, { useState, ComponentPropsWithoutRef } from 'react';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { Checkbox } from 'nav-frontend-skjema';

const HendelseTekster: any = {
    MOTEBEHOV: 'Ønsker møte', // MØTEBEHOV - UBEHANDLET
    MOTEPLANLEGGER_SVAR: 'Svar møteplanlegger', // Svar fra møteplanlegger
    UFORDELTE_BRUKERE: 'Ufordelte brukere', // Ikke tildelt veileder
};

interface Props extends ComponentPropsWithoutRef<any> {
    onValgteElementerChange: (filter: HendelseTypeFilters) => void;
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

export default ({ onValgteElementerChange, className }: Props) => {

    const intiialFilter: HendelseTypeFilters = {
        onskerMote: false,
        svartMote: false,
        ufordeltBruker: false,
    };
    const [ filter, setFilter ] = useState<HendelseTypeFilters>(intiialFilter);

    const elementer = Object.keys(HendelseTekster).map((key) => {
        const tekst: string = HendelseTekster[key];
        return { key, tekst };
    });

    return (
            <div className={...className}>
                <EkspanderbartPanel apen={true} tittel="Hendelse">
                    <div>
                        {elementer.map((k) => {
                            return <Checkbox label={k.tekst} id={k.key} key={k.key} onChange={(e) => {
                                // tslint:disable-next-line:no-console
                                const nyttFilter = lagNyttFilter(filter, k.tekst, e.target.checked);
                                setFilter(nyttFilter);
                                onValgteElementerChange(nyttFilter);
                            }} />;
                        })}
                    </div>
                </EkspanderbartPanel>
            </div>
    );
};
