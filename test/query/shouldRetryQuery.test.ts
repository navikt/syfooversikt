import { describe, expect, it } from "vitest";
import { MAX_QUERY_RETRIES, shouldRetryQuery } from "@/queryClient";
import {
  accessDeniedError,
  ApiErrorException,
  conflictError,
  generalError,
  loginRequiredError,
  networkError,
} from "@/api/errors";

function apiError(code?: number): ApiErrorException {
  const source = new Error("boom");
  return new ApiErrorException(generalError(source), code);
}

describe("shouldRetryQuery", () => {
  describe("client errors (4xx)", () => {
    it("does not retry a 401 login required error", () => {
      const error = new ApiErrorException(
        loginRequiredError(new Error("unauthorized")),
        401,
      );

      expect(shouldRetryQuery(0, error)).toBe(false);
    });

    it("does not retry a 403 access denied error", () => {
      const error = new ApiErrorException(
        accessDeniedError(new Error("forbidden")),
        403,
      );

      expect(shouldRetryQuery(0, error)).toBe(false);
    });

    it("does not retry other 4xx errors such as 409 conflict", () => {
      const error = new ApiErrorException(
        conflictError(new Error("conflict")),
        409,
      );

      expect(shouldRetryQuery(0, error)).toBe(false);
    });
  });

  describe("retryable errors", () => {
    it("retries 5xx server errors until the cap is reached", () => {
      const error = apiError(500);

      expect(shouldRetryQuery(0, error)).toBe(true);
      expect(shouldRetryQuery(MAX_QUERY_RETRIES - 1, error)).toBe(true);
      expect(shouldRetryQuery(MAX_QUERY_RETRIES, error)).toBe(false);
    });

    it("retries network errors without a status code", () => {
      const error = new ApiErrorException(networkError(new Error("offline")));

      expect(shouldRetryQuery(0, error)).toBe(true);
    });

    it("retries unknown non-ApiErrorException errors", () => {
      const error = new Error("unexpected");

      expect(shouldRetryQuery(0, error)).toBe(true);
    });

    it("stops retrying once the failure count reaches the cap", () => {
      const error = apiError(503);

      expect(shouldRetryQuery(MAX_QUERY_RETRIES, error)).toBe(false);
    });
  });
});
