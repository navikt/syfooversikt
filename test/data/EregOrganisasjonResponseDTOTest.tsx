import { describe, expect, it } from "vitest";
import {
  EregOrganisasjonResponseDTO,
  getVirksomhetsnavn,
} from "@/data/virksomhet/EregOrganisasjonResponseDTO";

describe("getVirksomhetsnavn", () => {
  it.each([
    {
      navn: { redigertnavn: "Redigert navn", navnelinje1: "Navn" },
      expected: "Redigert navn",
    },
    { navn: { redigertnavn: "", navnelinje1: "Navn" }, expected: "Navn" },
    { navn: { navnelinje1: "Navn" }, expected: "Navn" },
    { navn: {}, expected: "" },
    { navn: undefined, expected: "" },
  ])("returns '$expected' for $navn", ({ navn, expected }) => {
    const organisasjon: EregOrganisasjonResponseDTO = {
      type: "Virksomhet",
      navn,
    };

    const result = getVirksomhetsnavn(organisasjon);

    expect(result).toBe(expected);
  });
});
