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
  EregOrganisasjonEnrichedDTO,
  getVirksomhetsnavn,
} from "@/data/virksomhet/EregOrganisasjonResponseDTO.ts";
import { Buildings3Icon, FilesIcon } from "@navikt/aksel-icons";
import { toNaringskodeRequest } from "@/utils/naringskodeUtil.ts";
import { getForretningsadresse } from "@/utils/virksomhetUtil";
import { useGetFeatureToggles } from "@/data/unleash/unleashQueryHooks.ts";
import {
  useNaringskodeQueries,
  useSektorkodeQuery,
} from "@/data/virksomhet/ssbQueryHooks.ts";

const texts = {
  bransjerHeading: "Bransje",
  bransjerInfo: "Les mer om bransjer",
  sektorHeading: "Sektor",
  sectorLoading: "Laster sektornavn",
  sectorError: "Klarte ikke hente sektornavn",
  forretningsadresseHeading: "Forretningsadresse",
};

interface Props {
  virksomhet: EregOrganisasjonEnrichedDTO;
}

/** Displays organisation details and the sector of its nearest current parent. */
export function VirksomhetDataCell({ virksomhet }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const { toggles } = useGetFeatureToggles();

  const forretningsadresse = getForretningsadresse(virksomhet);
  const adresselinjer = [
    forretningsadresse?.adresselinje1,
    forretningsadresse?.adresselinje2,
    forretningsadresse?.adresselinje3,
    [forretningsadresse?.postnummer, forretningsadresse?.poststed]
      .filter(Boolean)
      .join(" "),
  ]
    .map((linje) => linje?.trim())
    .filter((linje) => linje !== undefined && linje !== "");

  const overordnetEnhet =
    virksomhet.overordnetEnhet ??
    (virksomhet.type === "JuridiskEnhet" ? virksomhet : undefined);
  const sektorkode =
    overordnetEnhet?.type === "Organisasjonsledd"
      ? overordnetEnhet.organisasjonsleddDetaljer?.sektorkode
      : overordnetEnhet?.juridiskEnhetDetaljer?.sektorkode;
  const sektorkodeQuery = useSektorkodeQuery(sektorkode ?? "", 2012, isOpen);
  const sektorkodeNavn = (sektorkodeQuery.data?.hierarki ?? []).find(
    (kode) => kode.code === sektorkode,
  )?.name;

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
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? popoverId : undefined}
      />
      <Popover
        placement={"top-start"}
        open={isOpen}
        onClose={() => setIsOpen(false)}
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

          {adresselinjer.length > 0 && (
            <>
              <Heading level="3" size="xsmall" className="mt-4 mb-2">
                {texts.forretningsadresseHeading}
              </Heading>
              {adresselinjer.map((linje, index) => (
                <BodyShort key={index} size="small" className="m-0">
                  {linje}
                </BodyShort>
              ))}
            </>
          )}

          {sektorkode && (
            <>
              <Heading size="xsmall" className="mt-4 mb-2">
                {texts.sektorHeading}
              </Heading>
              <BodyShort size="small" className="m-0">
                {sektorkodeNavn ? `${sektorkodeNavn}` : sektorkode}
              </BodyShort>
              {isOpen && sektorkodeQuery.isFetching && (
                <BodyShort size="small" className="m-0">
                  {texts.sectorLoading}
                </BodyShort>
              )}
              {isOpen && sektorkodeQuery.isError && (
                <BodyShort size="small" className="m-0">
                  {texts.sectorError}
                </BodyShort>
              )}
            </>
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
}
