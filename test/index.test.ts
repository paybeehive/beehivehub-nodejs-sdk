import BeehiveHub from "../src/index";
import { createRequest } from "../src/requests";

jest.mock("../src/requests");

describe("BeehiveHub SDK", () => {
  const apiKey = "test-api-key";
  let mockRequest: jest.Mock;

  beforeEach(() => {
    mockRequest = jest.fn();
    (createRequest as jest.Mock).mockReturnValue(mockRequest);
  });

  describe("SDK Initialization", () => {
    it("should create SDK instance with API key", () => {
      const sdk = BeehiveHub(apiKey);
      expect(sdk).toBeDefined();
      expect(sdk.transactions).toBeDefined();
      expect(sdk.customers).toBeDefined();
      expect(sdk.recipients).toBeDefined();
      expect(sdk.bankAccounts).toBeDefined();
      expect(sdk.transfers).toBeDefined();
      expect(sdk.company).toBeDefined();
      expect(sdk.paymentLinks).toBeDefined();
    });

    it("should use production environment by default", () => {
      BeehiveHub(apiKey);
      expect(createRequest).toHaveBeenCalledWith(apiKey, undefined);
    });

    it("should use sandbox environment when specified", () => {
      BeehiveHub(apiKey, { environment: "sandbox" });
      expect(createRequest).toHaveBeenCalledWith(apiKey, "sandbox");
    });
  });

  describe("transactions", () => {
    it("should call create transaction endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      const transactionData = {
        amount: 100,
        paymentMethod: "pix" as const,
        customer: {
          name: "João Silva",
          email: "joao@example.com",
          phone: "+5511999999999",
          document: { type: "cpf" as const, number: "12345678900" },
        },
      };

      mockRequest.mockResolvedValue({ id: "123", status: "paid" });
      const result = await sdk.transactions.create(transactionData);

      expect(mockRequest).toHaveBeenCalledWith("/transactions", {
        method: "POST",
        body: JSON.stringify(transactionData),
      });
      expect(result).toEqual({ id: "123", status: "paid" });
    });

    it("should call list transactions endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      mockRequest.mockResolvedValue([{ id: "123" }, { id: "456" }]);

      const result = await sdk.transactions.list({ page: 1, count: 50 });

      expect(mockRequest).toHaveBeenCalledWith("/transactions?page=1&count=50", {
        method: "GET",
      });
      expect(result).toEqual([{ id: "123" }, { id: "456" }]);
    });

    it("should call get transaction endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      mockRequest.mockResolvedValue({ id: "123", status: "paid" });

      const result = await sdk.transactions.get(123);

      expect(mockRequest).toHaveBeenCalledWith("/transactions/123", {
        method: "GET",
      });
      expect(result).toEqual({ id: "123", status: "paid" });
    });
  });

  describe("customers", () => {
    it("should call create customer endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      const customerData = {
        name: "João Silva",
        email: "joao@example.com",
        document: { type: "cpf" as const, number: "12345678900" },
        phone: "+5511999999999",
      };

      mockRequest.mockResolvedValue({ id: 123, ...customerData });
      const result = await sdk.customers.create(customerData);

      expect(mockRequest).toHaveBeenCalledWith("/customers", {
        method: "POST",
        body: JSON.stringify(customerData),
      });
      expect(result).toEqual({ id: 123, ...customerData });
    });

    it("should call list customers endpoint with required email", async () => {
      const sdk = BeehiveHub(apiKey);
      mockRequest.mockResolvedValue([{ id: 123 }, { id: 456 }]);

      const result = await sdk.customers.list({
        email: "cliente@example.com",
      });

      expect(mockRequest).toHaveBeenCalledWith(
        "/customers?email=cliente%40example.com",
        { method: "GET" },
      );
      expect(result).toEqual([{ id: 123 }, { id: 456 }]);
    });
  });

  describe("balance", () => {
    it("should call get balance endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      mockRequest.mockResolvedValue({
        amount: 3705,
        recipientId: 916
      });

      const result = await sdk.balance.get();

      expect(mockRequest).toHaveBeenCalledWith("/balance/available", {
        method: "GET",
      });
      expect(result).toEqual({
        amount: 3705,
        recipientId: 916
      });
    });
  });

  describe("recipients", () => {
    it("should call create recipient endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      const recipientData = {
        legalName: "Recebedor Teste Ltda",
        document: { type: "cnpj" as const, number: "58593776000142" },
        transferSettings: {
          transferEnabled: true,
          automaticAnticipationEnabled: false,
          anticipatableVolumePercentage: 100,
        },
        bankAccount: {
          bankCode: "001",
          agencyNumber: "1234",
          accountNumber: "12345",
          accountDigit: "6",
          type: "conta_corrente" as const,
          legalName: "Recebedor Teste Ltda",
          documentNumber: "58593776000142",
          documentType: "cnpj" as const,
        },
      };

      mockRequest.mockResolvedValue({ id: 916, ...recipientData });
      const result = await sdk.recipients.create(recipientData);

      expect(mockRequest).toHaveBeenCalledWith("/recipients", {
        method: "POST",
        body: JSON.stringify(recipientData),
      });
      expect(result).toEqual({ id: 916, ...recipientData });
    });

    it("should call list recipients endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      mockRequest.mockResolvedValue([{ id: 916 }, { id: 917 }]);

      const result = await sdk.recipients.list();

      expect(mockRequest).toHaveBeenCalledWith("/recipients", {
        method: "GET",
      });
      expect(result).toEqual([{ id: 916 }, { id: 917 }]);
    });

    it("should call get recipient endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      mockRequest.mockResolvedValue({ id: 916, legalName: "Recebedor Teste" });

      const result = await sdk.recipients.get(916);

      expect(mockRequest).toHaveBeenCalledWith("/recipients/916", {
        method: "GET",
      });
      expect(result).toEqual({ id: 916, legalName: "Recebedor Teste" });
    });

    it("should call update recipient endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      const updateData = { legalName: "Nome Atualizado" };
      mockRequest.mockResolvedValue({ id: 916, legalName: "Nome Atualizado" });

      const result = await sdk.recipients.update(916, updateData);

      expect(mockRequest).toHaveBeenCalledWith("/recipients/916", {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual({ id: 916, legalName: "Nome Atualizado" });
    });
  });

  describe("bankAccounts", () => {
    it("should call create bank account endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      const bankAccountData = {
        bankCode: "341",
        agencyNumber: "9876",
        accountNumber: "54321",
        accountDigit: "0",
        type: "conta_poupanca" as const,
        legalName: "Empresa Teste Ltda",
        documentNumber: "60572883000136",
        documentType: "cnpj" as const,
      };

      mockRequest.mockResolvedValue({ id: 1048, ...bankAccountData });
      const result = await sdk.bankAccounts.create(916, bankAccountData);

      expect(mockRequest).toHaveBeenCalledWith("/recipients/916/bank-accounts", {
        method: "POST",
        body: JSON.stringify(bankAccountData),
      });
      expect(result).toEqual({ id: 1048, ...bankAccountData });
    });

    it("should call list bank accounts endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      mockRequest.mockResolvedValue([{ id: 1048 }, { id: 1049 }]);

      const result = await sdk.bankAccounts.list(916);

      expect(mockRequest).toHaveBeenCalledWith("/recipients/916/bank-accounts", {
        method: "GET",
      });
      expect(result).toEqual([{ id: 1048 }, { id: 1049 }]);
    });
  });

  describe("transfers", () => {
    it("should call create transfer endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      const transferData = {
        amount: 50000,
        recipientId: 916,
      };

      mockRequest.mockResolvedValue({ id: 1838, amount: 50000, recipientId: 916, status: "pending" });
      const result = await sdk.transfers.create(transferData);

      expect(mockRequest).toHaveBeenCalledWith("/transfers", {
        method: "POST",
        body: JSON.stringify(transferData),
      });
      expect(result).toEqual({ id: 1838, amount: 50000, recipientId: 916, status: "pending" });
    });

    it("should call create transfer endpoint with bank account", async () => {
      const sdk = BeehiveHub(apiKey);
      const transferData = {
        amount: 50000,
        recipientId: 916,
        bankAccount: {
          bankCode: "001",
          agencyNumber: "1234",
          accountNumber: "12345",
          accountDigit: "6",
          type: "conta_corrente" as const,
          legalName: "Destinatário Teste",
          documentNumber: "60572883000136",
          documentType: "cnpj" as const,
        },
      };

      mockRequest.mockResolvedValue({ id: 1839, amount: 50000, recipientId: 916, status: "pending" });
      const result = await sdk.transfers.create(transferData);

      expect(mockRequest).toHaveBeenCalledWith("/transfers", {
        method: "POST",
        body: JSON.stringify(transferData),
      });
      expect(result).toEqual({ id: 1839, amount: 50000, recipientId: 916, status: "pending" });
    });

    it("should call get transfer endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      mockRequest.mockResolvedValue({ id: 1838, amount: 50000, status: "pending" });

      const result = await sdk.transfers.get(1838);

      expect(mockRequest).toHaveBeenCalledWith("/transfers/1838", {
        method: "GET",
      });
      expect(result).toEqual({ id: 1838, amount: 50000, status: "pending" });
    });
  });

  describe("company", () => {
    it("should call get company endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      mockRequest.mockResolvedValue({ id: "comp-123", name: "Test Company" });

      const result = await sdk.company.get();

      expect(mockRequest).toHaveBeenCalledWith("/company", {
        method: "GET",
      });
      expect(result).toEqual({ id: "comp-123", name: "Test Company" });
    });
  });

  describe("paymentLinks", () => {
    it("should call create payment link endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      const paymentLinkData = {
        title: "novo link",
        amount: 15000,
        alias: "7oVnM7sUTE",
        settings: {
          defaultPaymentMethod: "credit_card" as const,
          requestAddress: true,
          requestPhone: true,
          traceable: true,
          card: { enabled: true, freeInstallments: 1, maxInstallments: 12 },
          pix: { enabled: true, expiresInDays: 2 },
          boleto: { enabled: true, expiresInDays: 2 },
        },
      };

      mockRequest.mockResolvedValue({ id: 123, alias: "7oVnM7sUTE", title: "novo link", amount: 15000 });
      const result = await sdk.paymentLinks.create(paymentLinkData);

      expect(mockRequest).toHaveBeenCalledWith("/payment-links", {
        method: "POST",
        body: JSON.stringify(paymentLinkData),
      });
      expect(result).toEqual({
        id: 123,
        alias: "7oVnM7sUTE",
        title: "novo link",
        amount: 15000,
        url: "https://link.conta.paybeehive.com.br/7oVnM7sUTE",
      });
    });

    it("should generate alias when not provided on create", async () => {
      const sdk = BeehiveHub(apiKey);
      const dataWithoutAlias = { title: "link", amount: 1000 };
      mockRequest.mockResolvedValue({ id: 123, alias: "Ab1Cd2Ef3G", title: "link", amount: 1000 });

      await sdk.paymentLinks.create(dataWithoutAlias);

      const [, callOptions] = mockRequest.mock.calls[0];
      const body = JSON.parse(callOptions.body);
      expect(body.alias).toBeDefined();
      expect(body.alias).toMatch(/^[a-zA-Z0-9]{10}$/);
    });

    it("should call list payment links endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      mockRequest.mockResolvedValue([{ id: 123 }, { id: 456 }]);

      const result = await sdk.paymentLinks.list();

      expect(mockRequest).toHaveBeenCalledWith("/payment-links", {
        method: "GET",
      });
      expect(result).toEqual([{ id: 123 }, { id: 456 }]);
    });

    it("should call get payment link endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      mockRequest.mockResolvedValue({ id: 123, alias: "7oVnM7sUTE", title: "link atualizado", amount: 20000 });

      const result = await sdk.paymentLinks.get(247);

      expect(mockRequest).toHaveBeenCalledWith("/payment-links/247", {
        method: "GET",
      });
      expect(result).toEqual({
        id: 123,
        alias: "7oVnM7sUTE",
        title: "link atualizado",
        amount: 20000,
        url: "https://link.conta.paybeehive.com.br/7oVnM7sUTE",
      });
    });

    it("should preserve alias when provided on update", async () => {
      const sdk = BeehiveHub(apiKey);
      const updateData = { amount: 20000, alias: "meu-alias-custom" };
      mockRequest.mockResolvedValue({ id: 247, amount: 20000, alias: "meu-alias-custom" });

      await sdk.paymentLinks.update(247, updateData);

      const [, callOptions] = mockRequest.mock.calls[0];
      expect(JSON.parse(callOptions.body)).toEqual(updateData);
    });

    it("should call update payment link endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      const updateData = { amount: 20000 };
      mockRequest.mockResolvedValue({ id: 247, amount: 20000 });

      const result = await sdk.paymentLinks.update(247, updateData);

      const [, callOptions] = mockRequest.mock.calls[0];
      const body = JSON.parse(callOptions.body);
      expect(body).toMatchObject({ amount: 20000 });
      expect(body.alias).toBeDefined();
      expect(body.alias).toMatch(/^[a-zA-Z0-9]{10}$/);
      expect(mockRequest).toHaveBeenCalledWith("/payment-links/247", expect.objectContaining({ method: "PUT" }));
      expect(result).toEqual({ id: 247, amount: 20000 });
    });

    it("should call delete payment link endpoint", async () => {
      const sdk = BeehiveHub(apiKey);
      mockRequest.mockResolvedValue(undefined);

      await sdk.paymentLinks.delete(247);

      expect(mockRequest).toHaveBeenCalledWith("/payment-links/247", {
        method: "DELETE",
      });
    });
  });
});
