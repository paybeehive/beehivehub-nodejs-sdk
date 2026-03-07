import { BeehiveHubError } from "./exceptions";
import { createRequest, type Environment } from "./requests";
import { createTransactionsResource } from "./resources/transactions";
import { createCustomersResource } from "./resources/customers";
import { createBalanceResource } from "./resources/balance";
import { createRecipientsResource } from "./resources/recipients";
import { createBankAccountsResource } from "./resources/bankAccounts";
import { createTransfersResource } from "./resources/transfers";
import { createCompanyResource } from "./resources/company";
import { createPaymentLinksResource } from "./resources/paymentLinks";

/**
 * SDK for Beehive Hub API integration
 * 
 * @param apiKey - API secret key (SECRET_KEY)
 * @param options - Optional configuration
 * @param options.environment - Environment to use: 'production' (default) or 'sandbox'
 * @returns Object with methods to interact with the API
 * 
 * @example
 * ```ts
 * import BeehiveHub from "@paybeehive/beehivehub-nodejs-sdk";
 * 
 * // Production (default)
 * const beehive = BeehiveHub("your_secret_key");
 * 
 * // Sandbox
 * const beehiveSandbox = BeehiveHub("your_sandbox_key", {
 *   environment: "sandbox"
 * });
 * 
 * // Create a transaction
 * const transaction = await beehive.transactions.create({
 *   amount: 10000, // BRL 100.00 in cents
 *   payment_method: "credit_card",
 *   customer: {
 *     name: "John Doe",
 *     email: "john@example.com",
 *     documents: [{ type: "cpf", number: "12345678900" }],
 *     phone_numbers: ["+5511999999999"]
 *   },
 *   card_hash: "generated_card_hash"
 * });
 * ```
 */
export function createBeehiveHubClient(
  apiKey: string,
  options?: { environment?: Environment }
) {
  if (!apiKey) throw new BeehiveHubError("API key is required!");
  
  const request = createRequest(apiKey, options?.environment);

  return {
    transactions: createTransactionsResource(request),
    customers: createCustomersResource(request),
    balance: createBalanceResource(request),
    recipients: createRecipientsResource(request),
    bankAccounts: createBankAccountsResource(request),
    transfers: createTransfersResource(request),
    company: createCompanyResource(request),
    paymentLinks: createPaymentLinksResource(request, options?.environment),
  };
}
