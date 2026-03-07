// Export main client
export { createBeehiveHubClient as default } from "./client";

// Export constants (incl. payment link URLs)
export {
  BASE_URL_PRODUCTION,
  BASE_URL_SANDBOX,
  PAYMENT_LINK_URL_PRODUCTION,
  PAYMENT_LINK_URL_SANDBOX,
  BEEHIVE_DOCS,
} from "./constants";

// Export types
export type { Environment } from "./requests";
export type * from "./types";

// Export error classes
export {
  BeehiveHubError,
  BeehiveHubAPIError,
  BeehiveHubAuthenticationError,
  BeehiveHubValidationError,
  BeehiveHubNotFoundError,
  BeehiveHubRateLimitError,
  BeehiveHubNetworkError,
} from "./exceptions";
