import React from "react";
import Sokeresultat from "@/sider/oversikt/sokeresultat/Sokeresultat";
import { personregister } from "../data/fellesTestdata";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Filterable } from "@/utils/hendelseFilteringUtils";
import {
  AktivEnhetContext,
  AktivEnhetProvider,
} from "@/context/aktivEnhet/AktivEnhetContext";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import { stubAktivVeileder } from "../stubs/stubAktivVeileder";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { FilterContext } from "@/context/filters/FilterContext";
import { FilterState } from "@/context/filters/filterContextState";
import { testQueryClient } from "../testQueryClient";
import { renderWithRouter } from "../testRenderUtils";
import { routes } from "@/routers/routes";
import { stubModiaContext } from "../stubs/stubModiaContext.ts";
import { aktivEnhetMock } from "@/mocks/data/aktivEnhetMock.ts";

let queryClient: QueryClient;

const renderSokeresultat = () =>
  renderWithRouter(
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <AktivEnhetContext.Provider
          value={{
            aktivEnhet: aktivEnhetMock.aktivEnhet,
            handleAktivEnhetChanged: () => void 0,
          }}
        >
          <Sokeresultat allEvents={new Filterable(personregister)} />
        </AktivEnhetContext.Provider>
      </QueryClientProvider>
    </NotificationProvider>,
    routes.ENHET_OVERSIKT,
  );

describe("Sokeresultat", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    stubAktivVeileder();
    stubModiaContext();
  });

  it("Skal inneholde knapperad", async () => {
    renderSokeresultat();
    expect(await screen.findByRole("button", { name: "Tildel veileder" })).to
      .exist;
    const velgAlleCheckbox = screen.getByRole("checkbox", {
      name: "Velg alle",
      checked: false,
    });
    expect(velgAlleCheckbox).to.exist;
  });

  it("Skal inneholde liste av personer", async () => {
    renderSokeresultat();
    expect(await screen.findByRole("link", { name: "Navn, Et" })).to.exist;
    expect(screen.getByRole("link", { name: "Navn, Et Annet" })).to.exist;
  });

  it("Filters søkeresultat by motedatasvar", async () => {
    const filterSetMotedatasvar: FilterState = {
      tekstFilter: "",
      selectedVeilederIdents: [],
      selectedOptions: [],
      selectedCompanies: [],
      selectedBirthDates: [],
      selectedFristFilters: {
        selectedDatoOptions: [],
        selectedDateRange: {
          to: undefined,
          from: undefined,
        },
      },
      selectedAgeFilters: [],
      selectedHendelseType: {
        arbeidsgiverOnskerMote: false,
        onskerMote: false,
        dialogmotekandidat: false,
        dialogmotesvar: true,
        behandlerdialog: false,
        oppfolgingsoppgave: false,
        behandlerBerOmBistand: false,
        isAktivArbeidsuforhetvurdering: false,
        harFriskmeldingTilArbeidsformidling: false,
        isSenOppfolgingChecked: false,
        isAktivitetskravChecked: false,
        isAktivitetskravVurderStansChecked: false,
        isManglendeMedvirkningChecked: false,
        isKartleggingssporsmalChecked: false,
      },
      isUfordelteBrukereFilter: false,
    };

    renderWithRouter(
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          <FilterContext.Provider
            value={{
              filterState: filterSetMotedatasvar,
              dispatch: () => undefined,
            }}
          >
            <AktivEnhetProvider>
              <Sokeresultat allEvents={new Filterable(personregister)} />
            </AktivEnhetProvider>
          </FilterContext.Provider>
        </QueryClientProvider>
      </NotificationProvider>,
      routes.ENHET_OVERSIKT,
    );
    expect(await screen.findByRole("link", { name: "Navn, Et" })).to.exist;
    expect(screen.queryByRole("link", { name: "Navn, Et Annet" })).to.not.exist;
  });
});
