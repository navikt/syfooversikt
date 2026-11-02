import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { mockUnleash } from "@/mocks/mockUnleash";
import { mockSyfoveileder } from "@/mocks/syfoveileder/mockSyfoveileder";
import { mockNaringskode } from "@/mocks/syfoperson/mockNaringskode";

export const mockServer = setupServer(
  mockUnleash,
  ...mockSyfoveileder,
  mockNaringskode,
);

// Start server before all tests
beforeAll(() => mockServer.listen({ onUnhandledRequest: "warn" }));

//  Close server after all tests
afterAll(() => mockServer.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => mockServer.resetHandlers());
