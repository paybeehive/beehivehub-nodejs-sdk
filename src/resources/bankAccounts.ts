import type { RequestFunction } from "../requests";
import type {
  CreateBankAccountData,
  CreateBankAccountResponse,
  ListBankAccountsResponse,
} from "../types";

/**
 * Gerencia contas bancárias.
 */
export function createBankAccountsResource(request: RequestFunction) {
  return {
    /**
     * Adiciona uma nova conta bancária para um recebedor.
     * 
     * @param recipientId - ID do recebedor
     * @param data - Dados da conta bancária
     * @returns Dados da conta criada ou erro
     * @see https://paybeehive.readme.io/reference/adicionar-conta-bancaria
     * 
     * @example
     * ```ts
     * const bankAccount = await beehive.bankAccounts.create("916", {
     *   bankCode: "341",
     *   agencyNumber: "9876",
     *   accountNumber: "54321",
     *   accountDigit: "0",
     *   type: "conta_poupanca",
     *   legalName: "Empresa Teste Ltda",
     *   documentNumber: "60572883000136",
     *   documentType: "cnpj"
     * });
     * ```
     */
    create(recipientId: string, data: CreateBankAccountData): Promise<CreateBankAccountResponse> {
      return request(`/recipients/${recipientId}/bank-accounts`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    /**
     * Lista todas as contas bancárias de um recebedor.
     * 
     * @param recipientId - ID do recebedor
     * @returns Lista de contas bancárias ou erro
     * @see https://paybeehive.readme.io/reference/buscar-conta-bancaria
     * 
     * @example
     * ```ts
     * const bankAccounts = await beehive.bankAccounts.list("re_abc123");
     * ```
     */
    list(recipientId: string): Promise<ListBankAccountsResponse> {
      return request(`/recipients/${recipientId}/bank-accounts`, {
        method: "GET",
      });
    },
  };
}
