import type { Environment } from "../requests";
import type { RequestFunction } from "../requests";
import type {
  CreatePaymentLinkData,
  CreatePaymentLinkResponse,
  GetPaymentLinkResponse,
  ListPaymentLinksResponse,
  UpdatePaymentLinkData,
  UpdatePaymentLinkResponse,
} from "../types";
import {
  PAYMENT_LINK_URL_PRODUCTION,
  PAYMENT_LINK_URL_SANDBOX,
} from "../constants";
import { generateId } from "../utils";

function withUrl<T extends { alias?: string | null }>(
  data: T,
  env: Environment = "production",
): T & { url?: string } {
  if (!data?.alias) return data as T & { url?: string };
  const base =
    env === "sandbox" ? PAYMENT_LINK_URL_SANDBOX : PAYMENT_LINK_URL_PRODUCTION;
  return { ...data, url: `${base}/${data.alias}` };
}

/**
 * Gerencia links de pagamento (payment links).
 *
 * O SDK adiciona `url` às respostas (create, get, list, update) quando há `alias`.
 * - **Produção:** `https://link.conta.paybeehive.com.br/{alias}`
 * - **Sandbox:** `https://link.sandbox.hopysplit.com.br/{alias}`
 */
export function createPaymentLinksResource(
  request: RequestFunction,
  env: Environment = "production",
) {
  return {
    /**
     * Cria um novo link de pagamento.
     *
     * @param data - Dados do link (title, amount, alias, settings). Create e update aceitam payloads parciais. Se `alias` não for informado, um código alfanumérico de 10 caracteres é gerado automaticamente.
     * @returns Dados do link criado com `url` montada
     *
     * @example
     * ```ts
     * const paymentLink = await beehive.paymentLinks.create({
     *   title: "novo link alterado",
     *   alias: "alias_alterado",
     *   amount: 1000,
     *   settings: {
     *     defaultPaymentMethod: "credit_card",
     *     requestAddress: true,
     *     requestPhone: true,
     *     traceable: true,
     *     boleto: { enabled: true, expiresInDays: 0 },
     *     pix: { enabled: false, expiresInDays: 0 },
     *     card: { enabled: false, freeInstallments: 1, maxInstallments: 12 }
     *   }
     * });
     * ```
     */
    async create(
      data: CreatePaymentLinkData,
    ): Promise<CreatePaymentLinkResponse> {
      const payload = { ...data };
      const aliasEmpty =
        payload.alias == null ||
        (typeof payload.alias === "string" && payload.alias.trim() === "");
      if (aliasEmpty) {
        payload.alias = generateId(10, { includeCapitalCharacters: true });
      }
      const result = await request<CreatePaymentLinkResponse>("/payment-links", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return withUrl(result, env);
    },

    /**
     * Lista todos os links de pagamento.
     *
     * A API não aceita query parameters; retorna todos os links da empresa.
     *
     * @returns Lista de links de pagamento ou erro
     *
     * @example
     * ```ts
     * const paymentLinks = await beehive.paymentLinks.list();
     * ```
     */
    async list(): Promise<ListPaymentLinksResponse> {
      const result = await request<ListPaymentLinksResponse>(
        "/payment-links",
        { method: "GET" },
      );
      return Array.isArray(result)
        ? result.map((link) => withUrl(link, env))
        : result;
    },

    /**
     * Busca um link de pagamento específico pelo ID.
     *
     * @param id - ID do link de pagamento
     * @returns Dados do link ou erro
     *
     * @example
     * ```ts
     * const paymentLink = await beehive.paymentLinks.get("ck_abc123");
     * ```
     */
    async get(id: string): Promise<GetPaymentLinkResponse> {
      const result = await request<GetPaymentLinkResponse>(
        `/payment-links/${id}`,
        { method: "GET" },
      );
      return withUrl(result, env);
    },

    /**
     * Atualiza um link de pagamento existente.
     *
     * @param id - ID do link de pagamento
     * @param data - Dados para atualização (aceita atualizações parciais). Se `alias` não for informado, um código alfanumérico de 10 caracteres é gerado automaticamente.
     * @returns Dados do link atualizado ou erro
     *
     * @example
     * ```ts
     * const paymentLink = await beehive.paymentLinks.update("247", {
     *   title: "novo link alterado",
     *   alias: "alias_alterado",
     *   amount: 1000,
     *   settings: {
     *     defaultPaymentMethod: "credit_card",
     *     requestAddress: true,
     *     requestPhone: true,
     *     traceable: true,
     *     boleto: { enabled: true, expiresInDays: 0 },
     *     pix: { enabled: false, expiresInDays: 0 },
     *     card: { enabled: false, freeInstallments: 1, maxInstallments: 12 }
     *   }
     * });
     * ```
     */
    async update(
      id: string,
      data: UpdatePaymentLinkData,
    ): Promise<UpdatePaymentLinkResponse> {
      const payload = { ...data };
      const aliasEmpty =
        payload.alias == null ||
        (typeof payload.alias === "string" && payload.alias.trim() === "");
      if (aliasEmpty) {
        payload.alias = generateId(10, { includeCapitalCharacters: true });
      }
      const result = await request<UpdatePaymentLinkResponse>(
        `/payment-links/${id}`,
        { method: "PUT", body: JSON.stringify(payload) },
      );
      return withUrl(result, env);
    },

    /**
     * Exclui um link de pagamento.
     *
     * @param id - ID do link de pagamento
     *
     * @example
     * ```ts
     * await beehive.paymentLinks.delete("ck_abc123");
     * ```
     */
    delete(id: string): Promise<void> {
      return request(`/payment-links/${id}`, {
        method: "DELETE",
      });
    },
  };
}
