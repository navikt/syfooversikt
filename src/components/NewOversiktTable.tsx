import React, { ReactElement } from 'react';
import { Checkbox, Table } from '@navikt/ds-react';
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
import { Sorting, SortingKey, useSorting } from '@/hooks/useSorting';

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
  sorting: Sorting;
  setSorting: (sorting: Sorting) => void;
}

export const NewOversiktTable = ({
  personListe,
  selectedRows,
  setSelectedRows,
  sorting,
  setSorting,
}: Props): ReactElement => {
  const aktivBruker = useAktivBruker();
  const { columns } = useSorting();

  const handleSort = (sortKey: string | undefined) => {
    if (sortKey === sorting.orderBy && sorting.direction === 'descending') {
      setSorting({
        orderBy: 'NONE',
        direction: 'none',
      });
    } else {
      const newDirection =
        sorting.direction === 'ascending' ? 'descending' : 'ascending';
      setSorting({
        orderBy: sortKey as SortingKey,
        direction: newDirection,
      });
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
      sort={sorting}
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
