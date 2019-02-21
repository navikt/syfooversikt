export interface VeilederMotebehov {
    fnr: string;
    // TODO: Sett inn riktig struktur
}

export const enum VeilederMotebehovActionTypes {
    HENT_VEILEDER_MOTEBEHOV_FORESPURT = 'HENT_VEILEDER_MOTEBEHOV_FORESPURT',
    HENTER_VEILEDER_MOTEBEHOV = 'HENTER_VEILEDER_MOTEBEHOV',
    HENT_VEILEDER_MOTEBEHOV_FEILET = 'HENT_VEILEDER_MOTEBEHOV_FEILET',
    VEILEDER_MOTEBEHOV_HENTET = 'VEILEDER_MOTEBEHOV_HENTET',
}

export interface VeilederMotebehovState {
    readonly hentet: boolean;
    readonly henter: boolean;
    readonly hentingFeilet: boolean;
    readonly data: VeilederMotebehov;
}