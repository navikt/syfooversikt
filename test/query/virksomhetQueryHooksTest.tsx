import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import React, { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EREG_ROOT, SYFOPERSON_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { EregOrganisasjonResponseDTO } from "@/data/virksomhet/EregOrganisasjonResponseDTO";
import { NaringskodeStandard } from "@/data/virksomhet/Naringskode";
import {
  useNaringskodeQuery,
  useVirksomheterQueries,
} from "@/data/virksomhet/virksomhetQueryHooks";
import { mockServer } from "../setup";
import { testQueryClient } from "../testQueryClient";

interface Props {
  children: ReactNode;
}

describe("Ereg hierarchy mock", () => {
  it.each(["987654321", "987654322", "987654324", "987654328", "987654320"])(
    "returns references for %s and sector details only through a separate lookup",
    async (organisasjonsnummer) => {
      const url = `${EREG_ROOT}/organisasjon/${organisasjonsnummer}`;

      const virksomhet = await get<EregOrganisasjonResponseDTO>(
        `${url}?inkluderHierarki=true`,
      );

      expect(virksomhet.type).toBe("Virksomhet");
      if (virksomhet.type !== "Virksomhet") {
        throw new Error("Expected a virksomhet response");
      }
      expect(virksomhet.inngaarIJuridiskEnheter).toHaveLength(1);
      for (const reference of virksomhet.inngaarIJuridiskEnheter ?? []) {
        expect(reference.organisasjonsnummer).toBeDefined();
        expect(reference.navn?.navnelinje1).toBeDefined();
        expect(reference.bruksperiode?.fom).toBeDefined();
        expect(reference.gyldighetsperiode?.fom).toBeDefined();
        expect(reference).not.toHaveProperty("type");
        expect(reference).not.toHaveProperty("organisasjonDetaljer");
        expect(reference).not.toHaveProperty("juridiskEnhetDetaljer");
        expect(reference).not.toHaveProperty("sektorkode");

        const hovedenhet = await get<EregOrganisasjonResponseDTO>(
          `${EREG_ROOT}/organisasjon/${reference.organisasjonsnummer}`,
        );

        expect(hovedenhet.type).toBe("JuridiskEnhet");
        expect(hovedenhet.organisasjonsnummer).toBe(
          reference.organisasjonsnummer,
        );
        expect(hovedenhet.navn).toEqual(reference.navn);
        if (hovedenhet.type !== "JuridiskEnhet") {
          throw new Error("Expected a juridisk enhet response");
        }
        expect(hovedenhet.juridiskEnhetDetaljer?.sektorkode).toBeDefined();
      }
    },
  );

  it.each(["", "?inkluderHierarki=false"])(
    "omits hierarchy without inkluderHierarki=true (%s)",
    async (query) => {
      const url = `${EREG_ROOT}/organisasjon/987654321`;
      await get<EregOrganisasjonResponseDTO>(`${url}?inkluderHierarki=true`);

      const virksomhet = await get<EregOrganisasjonResponseDTO>(
        `${url}${query}`,
      );
      const withHierarchy = await get<EregOrganisasjonResponseDTO>(
        `${url}?inkluderHierarki=true`,
      );

      expect(virksomhet).not.toHaveProperty("inngaarIJuridiskEnheter");
      expect(withHierarchy).toHaveProperty("inngaarIJuridiskEnheter");
    },
  );
});

describe("useVirksomheterQueries", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = testQueryClient();
  });

  function Wrapper({ children }: Props) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  it("omits hierarchy by default", async () => {
    const requestedUrls: string[] = [];
    mockServer.use(
      http.get(`${EREG_ROOT}/organisasjon/100`, ({ request }) => {
        requestedUrls.push(request.url);
        return HttpResponse.json({
          type: "Virksomhet",
          organisasjonsnummer: "100",
          navn: { navnelinje1: "Virksomhet 100" },
        });
      }),
    );

    const { result } = renderHook(() => useVirksomheterQueries(["100"]), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.data).toHaveLength(1));
    expect(
      requestedUrls.map((url) =>
        new URL(url).searchParams.get("inkluderHierarki"),
      ),
    ).toEqual([null]);
  });

  it("deduplicates organisation requests within and across consumers", async () => {
    const legalEntityRequests = new Map<string, number>();
    mockServer.use(
      http.get(`${EREG_ROOT}/organisasjon/:number`, async ({ params }) => {
        const number = String(params.number);
        legalEntityRequests.set(
          number,
          (legalEntityRequests.get(number) ?? 0) + 1,
        );
        if (number === "300") {
          await new Promise((resolve) => setTimeout(resolve, 30));
        }
        return HttpResponse.json({
          type: "JuridiskEnhet",
          organisasjonsnummer: number,
          navn: { navnelinje1: `Juridisk enhet ${number}` },
          juridiskEnhetDetaljer: { sektorkode: `S-${number}` },
        });
      }),
    );

    const firstConsumer = renderHook(
      () => useVirksomheterQueries(["300", "300", ""]),
      { wrapper: Wrapper },
    );
    const secondConsumer = renderHook(
      () => useVirksomheterQueries(["301", "300"]),
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(firstConsumer.result.current.data[0]?.organisasjonsnummer).toBe(
        "300",
      );
      expect(secondConsumer.result.current.data[0]?.organisasjonsnummer).toBe(
        "301",
      );
      expect(secondConsumer.result.current.data[1]?.organisasjonsnummer).toBe(
        "300",
      );
    });

    expect(legalEntityRequests.get("300")).toBe(1);
    expect(legalEntityRequests.get("301")).toBe(1);
    expect(firstConsumer.result.current.data).toHaveLength(1);
  });

  it("isolates cached base responses by hierarchy flag", async () => {
    const requestedUrls: string[] = [];
    mockServer.use(
      http.get(`${EREG_ROOT}/organisasjon/100`, ({ request }) => {
        requestedUrls.push(request.url);
        const includeHierarchy = new URL(request.url).searchParams.get(
          "inkluderHierarki",
        );
        return HttpResponse.json({
          type: "Virksomhet",
          organisasjonsnummer: "100",
          navn: {
            navnelinje1: includeHierarchy
              ? "With hierarchy"
              : "Without hierarchy",
          },
          ...(includeHierarchy
            ? {
                inngaarIJuridiskEnheter: [{ organisasjonsnummer: "200" }],
              }
            : {}),
        });
      }),
    );

    const { result, rerender } = renderHook(
      ({ inkluderHierarki }: { inkluderHierarki: boolean }) =>
        useVirksomheterQueries(["100"], inkluderHierarki),
      {
        initialProps: { inkluderHierarki: false },
        wrapper: Wrapper,
      },
    );

    await waitFor(() =>
      expect(result.current.data[0]?.navn?.navnelinje1).toBe(
        "Without hierarchy",
      ),
    );
    rerender({ inkluderHierarki: true });

    await waitFor(() =>
      expect(result.current.data[0]?.navn?.navnelinje1).toBe("With hierarchy"),
    );
    expect(requestedUrls).toHaveLength(2);
    expect(
      requestedUrls.map((url) =>
        new URL(url).searchParams.get("inkluderHierarki"),
      ),
    ).toEqual([null, "true"]);
  });
});

describe("useNaringskodeQuery", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = testQueryClient();
  });

  function Wrapper({ children }: Props) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  it("fetches hierarchies and caches each standard separately", async () => {
    const standards: NaringskodeStandard[] = [1994, 2002, 2007, 2025];
    const handler = vi.fn(({ request }: { request: Request }) =>
      HttpResponse.json({
        standard: Number(new URL(request.url).searchParams.get("standard")),
        hierarki: [],
      }),
    );
    mockServer.use(http.get(`${SYFOPERSON_ROOT}/naringskode/62`, handler));

    const { result, rerender } = renderHook(
      ({ standard }: { standard: NaringskodeStandard }) =>
        useNaringskodeQuery("62", standard),
      { initialProps: { standard: 1994 }, wrapper: Wrapper },
    );

    for (const standard of standards) {
      rerender({ standard });

      await waitFor(() => expect(result.current.data?.standard).toBe(standard));
      expect(result.current.isSuccess).toBe(true);
    }

    for (const standard of standards) {
      rerender({ standard });

      expect(result.current.data?.standard).toBe(standard);
      expect(result.current.isFetching).toBe(false);
    }
    expect(handler).toHaveBeenCalledTimes(4);
  });

  it.each([
    {
      standard: 1994 as const,
      kode: "01.410",
      codes: ["01.410", "01.41", "01.4", "01", "A_", "A"],
    },
    {
      standard: 2002 as const,
      kode: "71.330",
      codes: ["71.330", "71.33", "71.3", "71", "K_", "K"],
    },
    {
      standard: 2007 as const,
      kode: "62.020",
      codes: ["62.020", "62.02", "62.0", "62", "J"],
    },
    {
      standard: 2025 as const,
      kode: "62.200",
      codes: ["62.200", "62.20", "62.2", "62", "K"],
    },
  ])(
    "fetches the full hierarchy for $standard",
    async ({ standard, kode, codes }) => {
      const { result } = renderHook(() => useNaringskodeQuery(kode, standard), {
        wrapper: Wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.hierarki.map(({ code }) => code)).toEqual(
        codes,
      );
      expect(result.current.data?.standard).toBe(standard);
    },
  );

  it.each([
    { standard: 1994 as const, kode: "A_", codes: ["A_", "A"] },
    { standard: 2002 as const, kode: "K_", codes: ["K_", "K"] },
    { standard: 2007 as const, kode: "62", codes: ["62", "J"] },
    { standard: 2025 as const, kode: "62", codes: ["62", "K"] },
  ])(
    "fetches the parent hierarchy for $kode in $standard",
    async ({ standard, kode, codes }) => {
      const { result } = renderHook(() => useNaringskodeQuery(kode, standard), {
        wrapper: Wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.hierarki.map(({ code }) => code)).toEqual(
        codes,
      );
    },
  );

  it("does not fetch without a code", () => {
    const handler = vi.fn(() => HttpResponse.json({}));
    mockServer.use(http.get(`${SYFOPERSON_ROOT}/naringskode/*`, handler));

    const { result } = renderHook(() => useNaringskodeQuery("", 2025), {
      wrapper: Wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
    expect(handler).not.toHaveBeenCalled();
  });

  it.each([404, 502])("exposes API errors (%s)", async (status) => {
    mockServer.use(
      http.get(`${SYFOPERSON_ROOT}/naringskode/62.200`, () =>
        HttpResponse.json({}, { status }),
      ),
    );

    const { result } = renderHook(() => useNaringskodeQuery("62.200", 2025), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
