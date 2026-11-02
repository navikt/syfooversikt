import React from "react";
import {
  BodyShort,
  Button,
  CopyButton,
  Detail,
  Heading,
  Link,
  List,
  Popover,
  Tooltip,
} from "@navikt/ds-react";
import {
  EregOrganisasjonResponseDTO,
  getVirksomhetsnavn,
} from "@/data/virksomhet/EregOrganisasjonResponseDTO.ts";
import { Buildings3Icon, FilesIcon } from "@navikt/aksel-icons";
import { useNaringskodeQueries } from "@/data/virksomhet/virksomhetQueryHooks.ts";
import { toNaringskodeRequest } from "@/utils/naringskodeUtil.ts";
import { useGetFeatureToggles } from "@/data/unleash/unleashQueryHooks.ts";

const texts = {
  bransjerHeading: "Bransje",
  bransjerInfo: "Les mer om bransjer",
};

interface Props {
  virksomhet: EregOrganisasjonResponseDTO;
}

export const VirksomhetDataCell = ({ virksomhet }: Props) => {
  const [openState, setOpenState] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const { toggles } = useGetFeatureToggles();

  const naringskoder = toNaringskodeRequest(
    virksomhet,
    toggles.isBransjerEnabled,
  );
  const naringskodeHirearkier = useNaringskodeQueries(naringskoder);

  const bransjer = naringskodeHirearkier.data.flatMap((naringskodeHirearki) => {
    return naringskodeHirearki?.hierarki?.filter(
      (kode) => kode.parentCode === null,
    );
  });

  const popoverId = "virksomhet-popover";

  return (
    <div className={"flex items-center gap-1"}>
      <Button
        size="xsmall"
        variant="tertiary"
        icon={<Buildings3Icon title="Se virksomhet" />}
        ref={setAnchorEl}
        onClick={() => setOpenState(!openState)}
        aria-expanded={openState}
        aria-controls={openState ? popoverId : undefined}
      />
      <Popover
        placement={"top-start"}
        open={openState}
        onClose={() => setOpenState(false)}
        anchorEl={anchorEl}
        id={popoverId}
      >
        <Popover.Content className={"min-w-100"}>
          <Heading size="small">{getVirksomhetsnavn(virksomhet)}</Heading>

          {virksomhet.organisasjonsnummer && (
            <div className={"flex items-center gap-0.5"}>
              <Detail className="m-0">{virksomhet.organisasjonsnummer}</Detail>
              <Tooltip content="Kopier organisasjonsnummer">
                <CopyButton
                  copyText={virksomhet.organisasjonsnummer}
                  icon={<FilesIcon aria-hidden />}
                  size="xsmall"
                />
              </Tooltip>
            </div>
          )}

          {bransjer.length > 0 && (
            <>
              <Heading size="xsmall" className="mt-4 mb-2">
                {texts.bransjerHeading}
              </Heading>
              <List size="small">
                {bransjer.map((bransje) => {
                  return (
                    <List.Item key={bransje.code}>
                      <BodyShort size="small" className="m-0">
                        {bransje.shortName}
                      </BodyShort>
                    </List.Item>
                  );
                })}
              </List>

              <Link
                className="mt-2"
                href="https://dataportal.ssb.no/classifications/6/codes"
                target="_blank"
                rel="noopener noreferrer"
              >
                {texts.bransjerInfo}
              </Link>
            </>
          )}
        </Popover.Content>
      </Popover>

      <BodyShort size="small" className="m-0 truncate max-w-50">
        {getVirksomhetsnavn(virksomhet)}
      </BodyShort>
    </div>
  );
};
