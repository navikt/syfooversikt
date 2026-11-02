import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  EregNaringDTO,
  EregOrganisasjonResponseDTO,
} from "@/data/virksomhet/EregOrganisasjonResponseDTO";
import {
  getStandardForNaring,
  isValidNaring,
  toNaringskodeRequest,
} from "@/utils/naringskodeUtil";

describe("naringskodeUtil", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-04T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("isValidNaring", () => {
    it.each([
      { period: undefined, expected: true },
      { period: { fom: "2025-09-01" }, expected: true },
      { period: { tom: "2026-11-05" }, expected: true },
      { period: { fom: "2026-11-04", tom: "2026-11-04" }, expected: true },
      { period: { fom: "2026-11-05" }, expected: false },
      { period: { tom: "2026-11-03" }, expected: false },
    ])("validates $period as $expected", ({ period, expected }) => {
      const naring: EregNaringDTO = {
        naeringskode: "62.200",
        gyldighetsperiode: period,
      };

      const isValid = isValidNaring(naring);

      expect(isValid).toBe(expected);
    });
  });

  describe("getStandardForNaring", () => {
    it.each([
      { fom: undefined, expected: null },
      { fom: "1993-12-31", expected: null },
      { fom: "1994-01-01", expected: 1994 },
      { fom: "2001-12-31", expected: 1994 },
      { fom: "2002-01-01", expected: 2002 },
      { fom: "2008-12-31", expected: 2002 },
      { fom: "2009-01-01", expected: 2007 },
      { fom: "2025-08-31", expected: 2007 },
      { fom: "2025-09-01", expected: 2025 },
    ])("resolves $fom to $expected", ({ fom, expected }) => {
      const naring: EregNaringDTO = {
        naeringskode: "62.200",
        gyldighetsperiode: { fom },
      };

      const standard = getStandardForNaring(naring);

      expect(standard).toBe(expected);
    });
  });

  describe("toNaringskodeRequest", () => {
    let virksomhet: EregOrganisasjonResponseDTO;

    beforeEach(() => {
      virksomhet = {
        organisasjonDetaljer: {
          naeringer: [
            {
              naeringskode: "62.200",
              gyldighetsperiode: { fom: "2025-09-01" },
            },
          ],
        },
      };
    });

    it("returns no requests when bransjer is disabled or omitted", () => {
      expect(toNaringskodeRequest(virksomhet, false)).toEqual([]);
      expect(toNaringskodeRequest(virksomhet)).toEqual([]);
    });

    it.each([
      {},
      { organisasjonDetaljer: {} },
      {
        organisasjonDetaljer: { naeringer: [] },
      },
    ])(
      "returns no requests when naringer are missing or empty: %j",
      (input) => {
        const requests = toNaringskodeRequest(input, true);

        expect(requests).toEqual([]);
      },
    );

    it("deduplicates code-and-standard pairs while preserving order and distinct standards", () => {
      virksomhet.organisasjonDetaljer = {
        naeringer: [
          { naeringskode: "62.200", gyldighetsperiode: { fom: "2025-09-01" } },
          { naeringskode: "70.200", gyldighetsperiode: { fom: "2025-09-01" } },
          { naeringskode: "62.200", gyldighetsperiode: { fom: "2026-01-01" } },
          { naeringskode: "62.200", gyldighetsperiode: { fom: "2009-01-01" } },
          { naeringskode: "62.200", gyldighetsperiode: { fom: "2010-01-01" } },
        ],
      };

      const requests = toNaringskodeRequest(virksomhet, true);

      expect(requests).toEqual([
        { naringskode: "62.200", standard: 2025 },
        { naringskode: "70.200", standard: 2025 },
        { naringskode: "62.200", standard: 2007 },
      ]);
      expect(toNaringskodeRequest(virksomhet, true)).toEqual(requests);
    });

    it("excludes invalid periods and unknown standards without suppressing later valid duplicates", () => {
      virksomhet.organisasjonDetaljer = {
        naeringer: [
          { naeringskode: "62.200", gyldighetsperiode: { fom: "2027-01-01" } },
          {
            naeringskode: "62.200",
            gyldighetsperiode: { fom: "2025-09-01", tom: "2026-11-03" },
          },
          { naeringskode: "62.200", gyldighetsperiode: { fom: "2025-09-01" } },
          { naeringskode: "01.410", gyldighetsperiode: { fom: "1993-01-01" } },
          { naeringskode: "71.330" },
        ],
      };

      const requests = toNaringskodeRequest(virksomhet, true);

      expect(requests).toEqual([{ naringskode: "62.200", standard: 2025 }]);
    });
  });
});
