import type { RequestFunction } from "../requests";
import type { GetBalanceResponse } from "../types";

/**
 * Gerencia saldo disponível.
 */
export function createBalanceResource(request: RequestFunction) {
  return {
    /**
     * Obtém o saldo disponível da conta.
     * 
     * @returns Dados do saldo ou erro
     * @see https://docs.beehivehub.io/api-reference/saldo/obter-saldo-dispon%C3%ADvel
     * 
     * @example
     * ```ts
     * try {
     *   const balance = await beehive.balance.get();
     *   console.log(`Saldo disponível: R$ ${balance.amount / 100}`);
     *   console.log(`Recipient ID: ${balance.recipientId}`);
     * } catch (error) {
     *   console.error('Erro ao obter saldo:', error.message);
     * }
     * ```
     */
    get(): Promise<GetBalanceResponse> {
      return request("/balance/available", {
        method: "GET",
      });
    },
  };
}
