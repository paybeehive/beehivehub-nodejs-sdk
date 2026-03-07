import { BASE_URL_PRODUCTION, BASE_URL_SANDBOX, DEFAULT_HEADERS } from "./constants";
import { 
  BeehiveHubAPIError, 
  BeehiveHubAuthenticationError, 
  BeehiveHubValidationError,
  BeehiveHubNotFoundError,
  BeehiveHubRateLimitError,
  BeehiveHubNetworkError
} from "./exceptions";

export type Environment = 'production' | 'sandbox';

export type RequestFunction = <TResponse>(
  path: string,
  options: Parameters<typeof fetch>[1],
) => Promise<TResponse>;

/**
 * Creates a request function configured with the API key
 * @param apiKey - Beehive Hub API secret key
 * @param environment - Environment to use (defaults to 'production')
 * @returns Function to make requests to the API
 */
export function createRequest(
  apiKey: string,
  environment: Environment = 'production',
): RequestFunction {
  const defaultHeaders = DEFAULT_HEADERS(apiKey);
  const baseUrl = environment === 'sandbox' ? BASE_URL_SANDBOX : BASE_URL_PRODUCTION;

  return async <TResponse>(
    path: string,
    options: Parameters<typeof fetch>[1],
  ): Promise<TResponse> => {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: { ...defaultHeaders, ...options?.headers },
      });

      const text = await response.text();
      // DELETE/204 pode retornar corpo vazio; response.json() em "" → "Unexpected end of JSON input"
      const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};

      if (!response.ok) {
        const err = data as { message?: string; error?: string; resource?: string; code?: string };
        const errorMessage = err.message ?? err.error ?? "Unknown error";

        switch (response.status) {
          case 400:
            throw new BeehiveHubValidationError(errorMessage, data);
          case 401:
            throw new BeehiveHubAuthenticationError(errorMessage);
          case 404:
            throw new BeehiveHubNotFoundError(err.resource ?? "Resource");
          case 429:
            throw new BeehiveHubRateLimitError(errorMessage);
          default:
            throw new BeehiveHubAPIError(errorMessage, response.status, err.code, data);
        }
      }

      return (text ? data : undefined) as TResponse;
    } catch (error) {
      // Re-throw BeehiveHub errors as-is
      if (error instanceof BeehiveHubAPIError || 
          error instanceof BeehiveHubAuthenticationError ||
          error instanceof BeehiveHubValidationError ||
          error instanceof BeehiveHubNotFoundError ||
          error instanceof BeehiveHubRateLimitError) {
        throw error;
      }
      
      // Wrap network/fetch errors
      throw new BeehiveHubNetworkError((error as Error).message);
    }
  };
}
