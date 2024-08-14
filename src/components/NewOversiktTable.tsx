import React, { ReactElement } from 'react';
import { Checkbox, Table } from '@navikt/ds-react';
import { VeilederColumn } from '@/components/VeilederColumn';
import { PersonData } from '@/api/types/personregisterTypes';
import { PersonRadVirksomhetColumn } from '@/components/PersonRadVirksomhetColumn';
import { OppfolgingstilfelleDTO } from '@/api/types/personoversiktTypes';
import { FristColumn } from '@/components/FristColumn';
import { Sorting, SortingKey, useSorting } from '@/hooks/useSorting';
import { LinkSyfomodiaperson } from '@/components/LinkSyfomodiaperson';
import { toLastnameFirstnameFormat } from '@/utils/stringUtil';
import { getHendelser } from '@/utils/statusColumnUtils';
import { useFeatureToggles } from '@/data/unleash/unleashQueryHooks';

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
  const { columns } = useSorting();
  const { toggles } = useFeatureToggles();

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
          {columns
            .filter(
              (column) =>
                toggles.isHendelseColumnEnabled || column.sortKey !== 'HENDELSE'
            )
            .map((col, index) => (
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
              {persondata.navn.length > 0 && (
                <LinkSyfomodiaperson
                  personData={persondata}
                  personident={fnr}
                  linkText={toLastnameFirstnameFormat(persondata.navn)}
                />
              )}
            </Table.HeaderCell>
            <Table.DataCell textSize="small">
              {persondata.navn.length > 0 ? (
                fnr
              ) : (
                <LinkSyfomodiaperson
                  personData={persondata}
                  personident={fnr}
                  linkText={fnr}
                />
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
            {toggles.isHendelseColumnEnabled && (
              <Table.DataCell textSize="small">
                {getHendelser(persondata).map((status, index) => (
                  <p key={index} className="m-0">
                    {status}
                  </p>
                ))}
              </Table.DataCell>
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
