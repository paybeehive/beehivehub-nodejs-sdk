import type { RequestFunction } from "../requests";
import type {
  GetCompanyResponse,
  UpdateCompanyData,
  UpdateCompanyResponse,
} from "../types";

/**
 * Gerencia informações da empresa.
 */
export function createCompanyResource(request: RequestFunction) {
  return {
    /**
     * Obtém os dados da empresa.
     * 
     * @returns Dados da empresa ou erro
     * @see https://paybeehive.readme.io/reference/dados-da-empresa
     * 
     * @example
     * ```ts
     * const company = await beehive.company.get();
     * ```
     */
    get(): Promise<GetCompanyResponse> {
      return request("/company", {
        method: "GET",
      });
    },

    /**
     * Atualiza os dados da empresa.
     * 
     * @param data - Dados para atualização
     * @returns Dados da empresa atualizada ou erro
     * @see https://paybeehive.readme.io/reference/atualizar-dados-da-empresa
     * 
     * @example
     * ```ts
     * const company = await beehive.company.update({
     *   invoiceDescriptor: "Beehive Hub",
     *   details: {
     *     averageRevenue: 10000,
     *     averageTicket: 100.50,
     *     physicalProducts: true,
     *     productsDescription: "Produtos físicos",
     *     siteUrl: "https://www.meusite.com.br",
     *     phone: "11999999999",
     *     email: "contato@meusite.com.br"
     *   }
     * });
     * ```
     */
    update(data: UpdateCompanyData): Promise<UpdateCompanyResponse> {
      return request("/company", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
  };
}
