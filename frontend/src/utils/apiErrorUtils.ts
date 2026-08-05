import { isAxiosError } from "axios";

const GENERIC_ERROR = "Something went wrong. Please try again later.";

/**
 * Returns a user-friendly error message from an API error.
 *
 * - Non-500 responses: returns the server's message or the provided `fallback`.
 * - 500 responses / network errors / unknown: returns a generic message.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error) && error.response) {
    const status = error.response.status;

    if (status >= 500) {
      return GENERIC_ERROR;
    }

    return error.response.data?.message || fallback;
  }

  return GENERIC_ERROR;
}
