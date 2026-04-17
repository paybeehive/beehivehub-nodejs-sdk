import { BEEHIVE_SDK_VERSION } from "./version";

export const BASE_URL_PRODUCTION = "https://api.conta.paybeehive.com.br/v1";
export const BASE_URL_SANDBOX = "https://api.sandbox.hopysplit.com.br/v1";

/** URL base para links de pagamento (produção). Use: `${PAYMENT_LINK_URL_PRODUCTION}/${alias}` */
export const PAYMENT_LINK_URL_PRODUCTION = "https://link.conta.paybeehive.com.br";
/** URL base para links de pagamento (sandbox). Use: `${PAYMENT_LINK_URL_SANDBOX}/${alias}` */
export const PAYMENT_LINK_URL_SANDBOX = "https://link.sandbox.hopysplit.com.br";

export const BEEHIVE_DOCS = "https://docs.beehivehub.io";

/**
 * Creates default headers for Beehive Hub API requests
 * @param apiKey - API secret key
 * @returns Headers configured for Basic authentication
 */
export function DEFAULT_HEADERS(apiKey: string) {
  // Beehive Hub uses Basic Authentication with format: Basic base64(SECRET_KEY:x)
  const credentials = Buffer.from(`${apiKey}:x`).toString("base64");
  
  return {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
    "User-Agent": `Beehive Hub NodeJS SDK (${BEEHIVE_SDK_VERSION})`,
  };
}
