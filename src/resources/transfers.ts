import type { RequestFunction } from "../requests";
import type {
  CreateTransferData,
  CreateTransferResponse,
  GetTransferResponse,
} from "../types";

/**
 * Gerencia transferências.
 */
export function createTransfersResource(request: RequestFunction) {
  return {
    /**
     * Cria uma nova transferência.
     * 
     * @param data - Dados da transferência
     * @returns Dados da transferência criada ou erro
     * @see https://paybeehive.readme.io/reference/criar-transferencia
     * 
     * @example
     * ```ts
     * const transfer = await beehive.transfers.create({
     *   amount: 50000,
     *   recipientId: 916
     * });
     *
     * // Com conta bancária opcional
     * const transferWithAccount = await beehive.transfers.create({
     *   amount: 50000,
     *   recipientId: 916,
     *   bankAccount: {
     *     bankCode: "001",
     *     agencyNumber: "1234",
     *     accountNumber: "12345",
     *     accountDigit: "6",
     *     type: "conta_corrente",
     *     legalName: "Destinatário Teste",
     *     documentNumber: "12345678900",
     *     documentType: "cpf"
     *   }
     * });
     * ```
     */
    create(data: CreateTransferData): Promise<CreateTransferResponse> {
      return request("/transfers", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    /**
     * Busca uma transferência específica pelo ID.
     * 
     * @param id - ID da transferência
     * @returns Dados da transferência ou erro
     * @see https://paybeehive.readme.io/reference/buscar-transferencia
     * 
     * @example
     * ```ts
     * const transfer = await beehive.transfers.get(123456);
     * ```
     */
    get(id: number): Promise<GetTransferResponse> {
      return request(`/transfers/${id}`, {
        method: "GET",
      });
    },
  };
}
