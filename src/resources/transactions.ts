import type { RequestFunction } from "../requests";
import type {
  CreateTransactionData,
  CreateTransactionResponse,
  GetTransactionResponse,
  ListTransactionsParams,
  ListTransactionsResponse,
  RefundTransactionResponse,
  UpdateDeliveryStatusData,
  UpdateDeliveryStatusResponse,
} from "../types";

/**
 * Gerencia transações de pagamento.
 */
export function createTransactionsResource(request: RequestFunction) {
  return {
    /**
     * Cria uma nova transação de pagamento.
     * 
     * @param data - Dados da transação
     * @returns Dados da transação criada ou erro
     * @see https://paybeehive.readme.io/reference/criar-transacao
     * 
     * @example
     * ```ts
     * const transaction = await beehive.transactions.create({
     *   amount: 10000,
     *   paymentMethod: "pix",
     *   customer: {
     *     name: "João Silva",
     *     email: "joao@example.com",
     *     document: { type: "cpf", number: "00000000191" },
     *     phone: "11999999999"
     *   },
     *   items: [
     *     { title: "Produto Teste", unitPrice: 10000, quantity: 1, tangible: true }
     *   ],
     *   postbackUrl: "https://example.com/webhook",
     *   metadata: { orderId: "1234567890" }
     * });
     * ```
     */
    create(data: CreateTransactionData): Promise<CreateTransactionResponse> {
      return request("/transactions", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    /**
     * Lista todas as transações.
     * 
     * @param params - Parâmetros de filtro e paginação
     * @returns Lista de transações ou erro
     * @see https://paybeehive.readme.io/reference/listar-transacoes
     * 
     * @example
     * ```ts
     * const transactions = await beehive.transactions.list({
     *   limit: 100,
     *   offset: 0,
     *   createdFrom: "2026-01-01T00:00:00"
     * });
     * ```
     */
    list(params?: ListTransactionsParams): Promise<ListTransactionsResponse> {
      const queryParams = new URLSearchParams(
        params as Record<string, string>,
      ).toString();
      return request(`/transactions${queryParams ? `?${queryParams}` : ""}`, {
        method: "GET",
      });
    },

    /**
     * Busca uma transação específica pelo ID.
     * 
     * @param id - ID da transação
     * @returns Dados da transação ou erro
     * @see https://paybeehive.readme.io/reference/buscar-transacao
     * 
     * @example
     * ```ts
     * const transaction = await beehive.transactions.get("123456");
     * ```
     */
    get(id: string): Promise<GetTransactionResponse> {
      return request(`/transactions/${id}`, {
        method: "GET",
      });
    },

    /**
     * Estorna uma transação.
     * 
     * @param id - ID da transação
     * @param amount - Valor a ser estornado (opcional, estorna valor total se não informado)
     * @returns Dados do estorno ou erro
     * @see https://paybeehive.readme.io/reference/estornar-transacao
     * 
     * @example
     * ```ts
     * // Estorno total
     * const refund = await beehive.transactions.refund("123456");
     * 
     * // Estorno parcial
     * const partialRefund = await beehive.transactions.refund("123456", 5000);
     * ```
     */
    refund(id: string, amount?: number): Promise<RefundTransactionResponse> {
      return request(`/transactions/${id}/refund`, {
        method: "POST",
        body: JSON.stringify(amount ? { amount } : {}),
      });
    },

    /**
     * Atualiza o status de entrega de uma transação.
     * 
     * @param id - ID da transação
     * @param data - Dados de entrega
     * @returns Dados da transação atualizada ou erro
     * @see https://paybeehive.readme.io/reference/alterar-status-de-entrega
     * 
     * @example
     * ```ts
     * const transaction = await beehive.transactions.updateDelivery("123456", {
     *   status: "in_transit",
     *   trackingCode: "BR123456789"
     * });
     * ```
     */
    updateDelivery(
      id: string,
      data: UpdateDeliveryStatusData,
    ): Promise<UpdateDeliveryStatusResponse> {
      return request(`/transactions/${id}/delivery`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
  };
}
