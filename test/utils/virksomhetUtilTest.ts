import dayjs from "dayjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  EregGyldighetsperiodeDTO,
  EregJuridiskEnhetDTO,
  EregVirksomhetDTO,
} from "@/data/virksomhet/EregOrganisasjonResponseDTO";
import {
  enrichWithJuridiskeVirksomheter,
  getJuridiskEnhetOrganisasjonsnummer,
} from "@/utils/virksomhetUtil";

describe("virksomhetUtil", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(dayjs("2026-11-24T12:00:00").toDate());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getJuridiskEnhetOrganisasjonsnummer", () => {
    it.each<{ period?: EregGyldighetsperiodeDTO; expected?: string }>([
      { period: undefined, expected: "200" },
      { period: { fom: "2026-11-24" }, expected: "200" },
      { period: { tom: "2026-11-24" }, expected: "200" },
      {
        period: { fom: "2026-11-24", tom: "2026-11-24" },
        expected: "200",
      },
      { period: { fom: "2026-11-25" }, expected: undefined },
      { period: { tom: "2026-11-23" }, expected: undefined },
    ])("selects $period as $expected", ({ period, expected }) => {
      const virksomhet: EregVirksomhetDTO = {
        type: "Virksomhet",
        inngaarIJuridiskEnheter: [
          { organisasjonsnummer: "200", gyldighetsperiode: period },
        ],
      };

      const nummer = getJuridiskEnhetOrganisasjonsnummer(virksomhet);

      expect(nummer).toBe(expected);
    });

    it("prefers the latest current reference and ignores references without a number", () => {
      const virksomhet: EregVirksomhetDTO = {
        type: "Virksomhet",
        inngaarIJuridiskEnheter: [
          { organisasjonsnummer: "200" },
          {
            organisasjonsnummer: "201",
            gyldighetsperiode: { fom: "2026-11-24" },
          },
          {
            organisasjonsnummer: "202",
            gyldighetsperiode: { fom: "2026-11-25" },
          },
          { gyldighetsperiode: { fom: "2026-11-24" } },
        ],
      };

      const nummer = getJuridiskEnhetOrganisasjonsnummer(virksomhet);

      expect(nummer).toBe("201");
    });
  });

  describe("enrichWithJuridiskeVirksomheter", () => {
    it("joins by number regardless of order, sharing legal entities without changing the inputs", () => {
      const virksomheter: EregVirksomhetDTO[] = ["200", "201", "200"].map(
        (nummer, index) => ({
          type: "Virksomhet",
          organisasjonsnummer: String(index),
          navn: { navnelinje1: `Virksomhet ${index}` },
          inngaarIJuridiskEnheter: [{ organisasjonsnummer: nummer }],
        }),
      );
      const juridiskeVirksomheter: EregJuridiskEnhetDTO[] = ["201", "200"].map(
        (nummer) => ({
          type: "JuridiskEnhet",
          organisasjonsnummer: nummer,
          juridiskEnhetDetaljer: { sektorkode: "2100" },
        }),
      );

      const enriched = enrichWithJuridiskeVirksomheter(
        virksomheter,
        juridiskeVirksomheter,
      );

      expect(enriched.map((virksomhet) => virksomhet.juridiskEnhet)).toEqual([
        juridiskeVirksomheter[1],
        juridiskeVirksomheter[0],
        juridiskeVirksomheter[1],
      ]);
      expect(enriched.map((virksomhet) => virksomhet.navn)).toEqual(
        virksomheter.map((virksomhet) => virksomhet.navn),
      );
      expect(
        virksomheter.every((virksomhet) => !("juridiskEnhet" in virksomhet)),
      ).toBe(true);
      expect(
        juridiskeVirksomheter.map(
          (virksomhet) => virksomhet.organisasjonsnummer,
        ),
      ).toEqual(["201", "200"]);
    });

    it("preserves organisations when references or fetched legal entities are missing", () => {
      const virksomheter: EregVirksomhetDTO[] = [
        { type: "Virksomhet", navn: { navnelinje1: "Uten referanse" } },
        {
          type: "Virksomhet",
          inngaarIJuridiskEnheter: [{ organisasjonsnummer: "200" }],
        },
      ];

      const enriched = enrichWithJuridiskeVirksomheter(virksomheter, [
        { type: "Organisasjonsledd", organisasjonsnummer: "200" },
      ]);

      expect(enriched).toHaveLength(2);
      expect(enriched[0]?.navn?.navnelinje1).toBe("Uten referanse");
      expect(
        enriched.every((virksomhet) => virksomhet.juridiskEnhet === undefined),
      ).toBe(true);
    });

    it("uses a legal entity directly without requesting another reference", () => {
      const juridiskEnhet: EregJuridiskEnhetDTO = {
        type: "JuridiskEnhet",
        organisasjonsnummer: "200",
        juridiskEnhetDetaljer: { sektorkode: "2100" },
      };

      const enriched = enrichWithJuridiskeVirksomheter([juridiskEnhet], []);

      expect(enriched[0]?.juridiskEnhet).toBe(juridiskEnhet);
      expect(
        getJuridiskEnhetOrganisasjonsnummer(juridiskEnhet),
      ).toBeUndefined();
    });
  });
});
