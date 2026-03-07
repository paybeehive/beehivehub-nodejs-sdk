import type { RequestFunction } from "../requests";
import type {
  CreateRecipientData,
  CreateRecipientResponse,
  GetRecipientResponse,
  ListRecipientsResponse,
  UpdateRecipientData,
  UpdateRecipientResponse,
} from "../types";

/**
 * Gerencia recebedores (recipients).
 */
export function createRecipientsResource(request: RequestFunction) {
  return {
    /**
     * Cria um novo recebedor.
     * 
     * @param data - Dados do recebedor
     * @returns Dados do recebedor criado ou erro
     * @see https://paybeehive.readme.io/reference/criar-recebedor
     * 
     * @example
     * ```ts
     * const recipient = await beehive.recipients.create({
     *   legalName: "Recebedor Teste Ltda",
     *   document: { type: "cnpj", number: "58593776000142" },
     *   transferSettings: {
     *     transferEnabled: true,
     *     automaticAnticipationEnabled: false,
     *     anticipatableVolumePercentage: 100
     *   },
     *   bankAccount: {
     *     bankCode: "001",
     *     agencyNumber: "1234",
     *     accountNumber: "12345",
     *     accountDigit: "6",
     *     type: "conta_corrente",
     *     legalName: "Recebedor Teste Ltda",
     *     documentNumber: "58593776000142",
     *     documentType: "cnpj"
     *   }
     * });
     * ```
     */
    create(data: CreateRecipientData): Promise<CreateRecipientResponse> {
      return request("/recipients", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    /**
     * Lista todos os recebedores.
     * 
     * @returns Lista de recebedores ou erro
     * @see https://paybeehive.readme.io/reference/listar-recebedores
     * 
     * @example
     * ```ts
     * const recipients = await beehive.recipients.list();
     * ```
     */
    list(): Promise<ListRecipientsResponse> {
      return request("/recipients", {
        method: "GET",
      });
    },

    /**
     * Busca um recebedor específico pelo ID.
     * 
     * @param id - ID do recebedor
     * @returns Dados do recebedor ou erro
     * @see https://paybeehive.readme.io/reference/buscar-recebedor
     * 
     * @example
     * ```ts
     * const recipient = await beehive.recipients.get("re_abc123");
     * ```
     */
    get(id: string): Promise<GetRecipientResponse> {
      return request(`/recipients/${id}`, {
        method: "GET",
      });
    },

    /**
     * Atualiza um recebedor existente.
     * 
     * @param id - ID do recebedor
     * @param data - Dados para atualização
     * @returns Dados do recebedor atualizado ou erro
     * @see https://paybeehive.readme.io/reference/atualizar-recebedor
     * 
     * @example
     * ```ts
     * const recipient = await beehive.recipients.update("916", {
     *   legalName: "Beehive Sandbox"
     * });
     * ```
     */
    update(
      id: string,
      data: UpdateRecipientData,
    ): Promise<UpdateRecipientResponse> {
      return request(`/recipients/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
  };
}
