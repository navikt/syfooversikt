import React from "react";
import { BodyShort } from "@navikt/ds-react";
import {
  EregOrganisasjonResponseDTO,
  getVirksomhetsnavn,
} from "@/data/virksomhet/EregVirksomhetsnavn.ts";

interface Props {
  virksomhet: EregOrganisasjonResponseDTO;
}

export const VirksomhetDataCell = ({ virksomhet }: Props) => {
  return (
    <div className={"flex items-center gap-1"}>
      <BodyShort size="small" className="m-0 truncate">
        {getVirksomhetsnavn(virksomhet)}
      </BodyShort>
    </div>
  );
};
