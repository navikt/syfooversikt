import React, { useEffect, useRef, useState } from "react";
import { PersonregisterState } from "@/api/types/personregisterTypes";
import {
  Filterable,
  filterHendelser,
  filterOnAge,
  filterOnBirthDates,
  filterOnCompany,
  filterOnDato,
  filterOnFodselsnummerOrName,
  getSortedEventsFromSortingType,
} from "@/utils/hendelseFilteringUtils";
import { useFilters } from "@/context/filters/FilterContext";
import { TabType, useTabType } from "@/hooks/useTabType";
import { filterUfordelteBrukere } from "@/sider/oversikt/filter/UfordelteBrukereFilter";
import Toolbar from "@/sider/oversikt/sokeresultat/toolbar/Toolbar";
import OversiktTable from "@/sider/oversikt/sokeresultat/oversikttable/OversiktTable";
import { useSorting } from "@/hooks/useSorting";
import { useVeiledereQuery } from "@/data/veiledereQueryHooks";
import EmptyDrawer from "@/sider/oversikt/sokeresultat/oversikttable/EmptyDrawer";
import { useAktivBruker } from "@/data/modiacontext/modiacontextQueryHooks.ts";
import AppSpinner from "@/components/AppSpinner.tsx";
import { usePagination } from "@/hooks/usePagination";

interface Props {
  allEvents: Filterable<PersonregisterState>;
}

export default function Sokeresultat({ allEvents }: Props) {
  const aktivBruker = useAktivBruker();

  const { filterState } = useFilters();
  const { selectedTab } = useTabType();
  const { sorting, setSorting } = useSorting();
  const veiledereQuery = useVeiledereQuery();

  const [selectedPersoner, setSelectedPersoner] = useState<string[]>([]);
  const hasJumpedToInitialPage = useRef(false);

  useEffect(() => {
    setSelectedPersoner([]);
  }, [selectedTab]);

  let filteredEvents = allEvents
    .applyFilter((v) => filterOnCompany(v, filterState.selectedCompanies))
    .applyFilter((v) => filterOnBirthDates(v, filterState.selectedBirthDates))
    .applyFilter((v) => filterOnDato(v, filterState.selectedFristFilters))
    .applyFilter((v) => filterOnAge(v, filterState.selectedAgeFilters))
    .applyFilter((v) => filterHendelser(v, filterState.selectedHendelseType))
    .applyFilter((v) =>
      filterOnFodselsnummerOrName(v, filterState.tekstFilter),
    );

  if (selectedTab === TabType.ENHETENS_OVERSIKT) {
    filteredEvents = filteredEvents.applyFilter((v) =>
      filterUfordelteBrukere(v, filterState.isUfordelteBrukereFilter),
    );
  }

  const allFnr = Object.keys(filteredEvents.value);
  const pagination = usePagination(allFnr.length);

  const checkAllHandler = (checked: boolean): void => {
    setSelectedPersoner(checked ? allFnr : []);
  };

  const sortedPersonregister = getSortedEventsFromSortingType(
    filteredEvents.value,
    veiledereQuery.data || [],
    sorting,
  );
  const personListe = Object.entries(sortedPersonregister).slice(
    pagination.startItem,
    pagination.endItem,
  );

  useEffect(() => {
    if (hasJumpedToInitialPage.current || !aktivBruker.isSuccess) {
      return;
    }

    const initialActivePersonFnr = aktivBruker.data.aktivBruker;
    const personIndex = Object.keys(sortedPersonregister).indexOf(
      initialActivePersonFnr,
    );
    if (personIndex === -1) return;

    hasJumpedToInitialPage.current = true;
    pagination.setPage(
      Math.floor(personIndex / pagination.numberOfItemsPerPage) + 1,
    );
  }, [aktivBruker, sortedPersonregister, pagination]);

  if (!aktivBruker.isSuccess) {
    return (
      <div>
        <AppSpinner />
      </div>
    );
  }

  return (
    <div className="flex-[3]">
      <Toolbar
        numberOfItemsTotal={allFnr.length}
        pagination={pagination}
        isAllSelected={allFnr.length === selectedPersoner.length}
        checkAllHandler={checkAllHandler}
        selectedPersoner={selectedPersoner}
        setSelectedPersoner={setSelectedPersoner}
      />

      {!personListe.length ? (
        <EmptyDrawer />
      ) : (
        <OversiktTable
          sorting={sorting}
          setSorting={setSorting}
          personListe={personListe}
          selectedRows={selectedPersoner}
          setSelectedRows={setSelectedPersoner}
          initialActivePersonFnr={aktivBruker.data.aktivBruker}
        />
      )}
    </div>
  );
}
