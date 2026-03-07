import type { RequestFunction } from "../requests";
import type {
  CreateCustomerData,
  CreateCustomerResponse,
  GetCustomerResponse,
  ListCustomersParams,
  ListCustomersResponse,
} from "../types";

/**
 * Gerencia clientes.
 */
export function createCustomersResource(request: RequestFunction) {
  return {
    /**
     * Cria um novo cliente.
     * 
     * @param data - Dados do cliente
     * @returns Dados do cliente criado ou erro
     * @see https://paybeehive.readme.io/reference/criar-cliente
     * 
     * @example
     * ```ts
     * const customer = await beehive.customers.create({
     *   name: "Maria Santos",
     *   email: "maria@example.com",
     *   document: { type: "cpf", number: "98765432100" },
     *   phone: "11988888888",
     *   address: {
     *     street: "Rua Teste",
     *     streetNumber: "456",
     *     complement: "Apto 101",
     *     neighborhood: "Jardins",
     *     zipCode: "01234567",
     *     city: "São Paulo",
     *     state: "SP",
     *     country: "br"
     *   }
     * });
     * ```
     */
    create(data: CreateCustomerData): Promise<CreateCustomerResponse> {
      return request("/customers", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    /**
     * Lista clientes por email.
     *
     * O parâmetro `email` é obrigatório. A API não aceita parâmetros de
     * paginação convencionais (page, count, etc.).
     *
     * @param params - Parâmetros de busca (email obrigatório)
     * @returns Lista de clientes ou erro
     *
     * @example
     * ```ts
     * const customers = await beehive.customers.list({
     *   email: "cliente@example.com"
     * });
     * ```
     */
    list(params: ListCustomersParams): Promise<ListCustomersResponse> {
      const queryParams = new URLSearchParams({
        email: params.email,
      }).toString();
      return request(`/customers?${queryParams}`, {
        method: "GET",
      });
    },

    /**
     * Busca um cliente específico pelo ID.
     * 
     * @param id - ID do cliente
     * @returns Dados do cliente ou erro
     * @see https://paybeehive.readme.io/reference/buscar-cliente
     * 
     * @example
     * ```ts
     * const customer = await beehive.customers.get(123456);
     * ```
     */
    get(id: number): Promise<GetCustomerResponse> {
      return request(`/customers/${id}`, {
        method: "GET",
      });
    },
  };
}
