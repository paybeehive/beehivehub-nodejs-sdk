import { BEEHIVE_DOCS } from "./constants";

/**
 * Standard class for Beehive Hub exceptions and errors.
 * 
 * Can be serialized to JSON through the `toJSON` method.
 */
export class BeehiveHubError extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode?: number, code?: string, details?: unknown) {
    super(
      `Beehive Hub Error: ${message}\n\nFor more information, see the documentation at: ${BEEHIVE_DOCS}`,
    );
    this.name = "BeehiveHubError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      details: this.details,
    };
  }
}

/**
 * Error thrown when API request fails (4xx or 5xx responses)
 */
export class BeehiveHubAPIError extends BeehiveHubError {
  constructor(message: string, statusCode: number, code?: string, details?: unknown) {
    super(message, statusCode, code, details);
    this.name = "BeehiveHubAPIError";
  }
}

/**
 * Error thrown when authentication fails (401 Unauthorized)
 */
export class BeehiveHubAuthenticationError extends BeehiveHubError {
  constructor(message = "Invalid API key or authentication failed") {
    super(message, 401, "authentication_error");
    this.name = "BeehiveHubAuthenticationError";
  }
}

/**
 * Error thrown when request validation fails (400 Bad Request)
 */
export class BeehiveHubValidationError extends BeehiveHubError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "validation_error", details);
    this.name = "BeehiveHubValidationError";
  }
}

/**
 * Error thrown when resource is not found (404 Not Found)
 */
export class BeehiveHubNotFoundError extends BeehiveHubError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "not_found");
    this.name = "BeehiveHubNotFoundError";
  }
}

/**
 * Error thrown when rate limit is exceeded (429 Too Many Requests)
 */
export class BeehiveHubRateLimitError extends BeehiveHubError {
  constructor(message = "Rate limit exceeded") {
    super(message, 429, "rate_limit_error");
    this.name = "BeehiveHubRateLimitError";
  }
}

/**
 * Error thrown when network request fails
 */
export class BeehiveHubNetworkError extends BeehiveHubError {
  constructor(message: string) {
    super(`Network error: ${message}`, undefined, "network_error");
    this.name = "BeehiveHubNetworkError";
  }
}
