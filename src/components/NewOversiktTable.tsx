import React, { ReactElement } from 'react';
import { Checkbox, SortState, Table } from '@navikt/ds-react';
import { VeilederColumn } from '@/components/VeilederColumn';
import { PersonData } from '@/api/types/personregisterTypes';
import {
  lenkeTilModia,
  lenkeTilModiaEnkeltperson,
  lenkeTilModiaEnkeltpersonFnr,
} from '@/utils/lenkeUtil';
import { useAktivBruker } from '@/data/modiacontext/useAktivBruker';
import { PersonRadVirksomhetColumn } from '@/components/PersonRadVirksomhetColumn';
import { OppfolgingstilfelleDTO } from '@/api/types/personoversiktTypes';
import { FristColumn } from '@/components/FristColumn';
import { Labels } from '@/components/Labels';
import { SortingKey, SortingType, useSorting } from '@/hooks/useSorting';

const getVarighetOppfolgingstilfelle = (
  oppfolgingstilfelle: OppfolgingstilfelleDTO | undefined
): string => {
  return oppfolgingstilfelle
    ? `${oppfolgingstilfelle.varighetUker} uker`
    : 'Ukjent';
};

interface Props {
  personListe: [string, PersonData][];
  selectedRows: string[];
  setSelectedRows: (rows: string[]) => void;
  sortingType: SortingType;
  setSortingType: (sortingType: SortingType) => void;
}

export const NewOversiktTable = ({
  personListe,
  selectedRows,
  setSelectedRows,
  sortingType,
  setSortingType,
}: Props): ReactElement => {
  const aktivBruker = useAktivBruker();
  const { columns, toSortState, toSortingType } = useSorting();

  const sortState: SortState | undefined = toSortState(sortingType);
  const handleSort = (sortKey: string | undefined) => {
    if (sortKey && sortState) {
      setSortingType(toSortingType(sortKey as SortingKey, sortState.direction));
    } else {
      setSortingType('NONE');
    }
  };

  const onPersonClick = (fnr: string, personData: PersonData) => {
    aktivBruker.mutate(fnr, {
      onSuccess: () => {
        window.location.href = lenkeTilModia(personData);
      },
    });
  };

  const allRowsSelected = personListe.length === selectedRows.length;
  const anyRowsSelected = selectedRows.length > 0;
  const isRowSelected = (fnr: string) => selectedRows.includes(fnr);

  const toggleSelectedRow = (fnr: string) => {
    if (isRowSelected(fnr)) {
      setSelectedRows(selectedRows.filter((value) => value !== fnr));
    } else {
      setSelectedRows([...selectedRows, fnr]);
    }
  };

  const toggleSelectAllRows = () => {
    if (anyRowsSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(personListe.map(([fnr]) => fnr));
    }
  };

  return (
    <Table
      sort={sortState}
      size="small"
      zebraStripes
      className="bg-white mt-2"
      onSortChange={handleSort}
    >
      <Table.Header>
        <Table.Row>
          <Table.DataCell>
            <Checkbox
              checked={allRowsSelected}
              indeterminate={anyRowsSelected && !allRowsSelected}
              onChange={toggleSelectAllRows}
              hideLabel
            >
              Velg alle
            </Checkbox>
          </Table.DataCell>
          {columns.map((col, index) => (
            <Table.ColumnHeader key={index} sortKey={col.sortKey} sortable>
              {col.sortingText}
            </Table.ColumnHeader>
          ))}
          <Table.DataCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {personListe.map(([fnr, persondata], index) => (
          <Table.Row key={index}>
            <Table.DataCell>
              <Checkbox
                checked={isRowSelected(fnr)}
                hideLabel
                onChange={() => toggleSelectedRow(fnr)}
                aria-labelledby={`id-${fnr}`}
              >
                {' '}
              </Checkbox>
            </Table.DataCell>
            <Table.HeaderCell scope="row" textSize="small">
              {lenkeTilModiaEnkeltperson(persondata, () =>
                onPersonClick(fnr, persondata)
              )}
            </Table.HeaderCell>
            <Table.DataCell textSize="small">
              {lenkeTilModiaEnkeltpersonFnr(persondata, fnr, () =>
                onPersonClick(fnr, persondata)
              )}
            </Table.DataCell>
            <Table.DataCell textSize="small">
              <PersonRadVirksomhetColumn personData={persondata} />
            </Table.DataCell>
            <Table.DataCell textSize="small">
              <VeilederColumn personData={persondata} />
            </Table.DataCell>
            <Table.DataCell textSize="small">
              {getVarighetOppfolgingstilfelle(
                persondata.latestOppfolgingstilfelle
              )}
            </Table.DataCell>
            <Table.DataCell textSize="small">
              <FristColumn personData={persondata} />
            </Table.DataCell>
            <Table.DataCell textSize="small">
              <Labels personData={persondata} />
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
