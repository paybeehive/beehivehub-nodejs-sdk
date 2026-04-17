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
     * @see https://docs.beehivehub.io/api-reference/recebedores/criar-recebedor
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
     * @see https://docs.beehivehub.io/api-reference/recebedores/listar-recebedores
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
     * @see https://docs.beehivehub.io/api-reference/recebedores/buscar-recebedor
     * 
     * @example
     * ```ts
     * const recipient = await beehive.recipients.get(916);
     * ```
     */
    get(id: number): Promise<GetRecipientResponse> {
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
     * @see https://docs.beehivehub.io/api-reference/recebedores/atualizar-recebedor
     * 
     * @example
     * ```ts
     * const recipient = await beehive.recipients.update(916, {
     *   legalName: "Beehive Sandbox"
     * });
     * ```
     */
    update(
      id: number,
      data: UpdateRecipientData,
    ): Promise<UpdateRecipientResponse> {
      return request(`/recipients/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
  };
}
