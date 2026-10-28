import express from "express";
import { createServer, type Server } from "node:http";
import { once } from "node:events";
import { http, passthrough } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "@navikt/pino-logger";
import { setupCspReporting } from "../server/csp";
import { mockServer } from "./setup";

vi.mock("@navikt/pino-logger", () => ({
  logger: { warn: vi.fn() },
}));

describe("CSP reporting", () => {
  let server: Server;
  let url: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockServer.use(http.all(/^http:\/\/127\.0\.0\.1:/, passthrough));
    const app = express();
    setupCspReporting(app);
    app.use(express.json());
    server = createServer(app).listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Expected a TCP server address");
    }
    url = `http://127.0.0.1:${address.port}/csp-report`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it.each([
    ["application/csp-report", { "csp-report": { "blocked-uri": "inline" } }],
    [
      "application/reports+json",
      [{ type: "csp-violation", body: { blockedURL: "inline" } }],
    ],
    [
      "application/reports+json",
      { type: "csp-violation", body: { blockedURL: "inline" } },
    ],
    ["application/json", { blockedURL: "inline" }],
  ])("accepts %s reports", async (contentType, body) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body: JSON.stringify(body),
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("Reporting-Endpoints")).toBe(
      'csp-endpoint="/csp-report"',
    );
    expect(logger.warn).toHaveBeenCalledExactlyOnceWith(
      { cspViolation: expect.objectContaining({ blockedOrigin: "inline" }) },
      "CSP violation reported",
    );
  });

  it("only logs sanitized fields, never URL paths or report contents", async () => {
    const body = {
      "csp-report": {
        "effective-directive": "SCRIPT-SRC",
        "violated-directive": "script-src https://private.example/person/123",
        "blocked-uri": "https://blocked.example/person/123?secret=value",
        "document-uri": "https://app.example/person/123",
        "script-sample": "sensitive content",
        disposition: "enforce",
        "status-code": 200,
      },
    };

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/csp-report" },
      body: JSON.stringify(body),
    });

    expect(logger.warn).toHaveBeenCalledExactlyOnceWith(
      {
        cspViolation: {
          effectiveDirective: "script-src",
          violatedDirective: "script-src",
          blockedOrigin: "https://blocked.example",
          disposition: "enforce",
          statusCode: 200,
        },
      },
      "CSP violation reported",
    );
  });

  it("ignores unrelated reports and invalid report bodies in a batch", async () => {
    const body = [
      { type: "other-report", body: { blockedURL: "inline" } },
      { type: "csp-violation", body: null },
      { type: "csp-violation", body: "invalid" },
    ];

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/reports+json" },
      body: JSON.stringify(body),
    });

    expect(response.status).toBe(204);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it("rejects reports larger than 32kb before the general JSON parser", async () => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ padding: "x".repeat(33 * 1024) }),
    });

    expect(response.status).toBe(413);
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
