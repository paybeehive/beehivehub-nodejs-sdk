import {
  BASE_URL_PRODUCTION,
  BASE_URL_SANDBOX,
  PAYMENT_LINK_URL_PRODUCTION,
  PAYMENT_LINK_URL_SANDBOX,
  BEEHIVE_DOCS,
  DEFAULT_HEADERS,
} from "../src/constants";

describe("Constants", () => {
  it("should have correct BASE_URL_PRODUCTION", () => {
    expect(BASE_URL_PRODUCTION).toBe("https://api.conta.paybeehive.com.br/v1");
  });

  it("should have correct BASE_URL_SANDBOX", () => {
    expect(BASE_URL_SANDBOX).toBe("https://api.sandbox.hopysplit.com.br/v1");
  });

  it("should have correct BEEHIVE_DOCS", () => {
    expect(BEEHIVE_DOCS).toBe("https://paybeehive.readme.io/reference");
  });

  it("should have correct PAYMENT_LINK_URL_PRODUCTION", () => {
    expect(PAYMENT_LINK_URL_PRODUCTION).toBe(
      "https://link.conta.paybeehive.com.br",
    );
  });

  it("should have correct PAYMENT_LINK_URL_SANDBOX", () => {
    expect(PAYMENT_LINK_URL_SANDBOX).toBe(
      "https://link.sandbox.hopysplit.com.br",
    );
  });

  describe("DEFAULT_HEADERS", () => {
    it("should create headers with Basic authentication", () => {
      const apiKey = "test-api-key";
      const headers = DEFAULT_HEADERS(apiKey);

      expect(headers).toHaveProperty("Authorization");
      expect(headers.Authorization).toMatch(/^Basic /);
      expect(headers).toHaveProperty("Content-Type", "application/json");
      expect(headers).toHaveProperty("User-Agent");
    });

    it("should encode API key correctly in Basic auth", () => {
      const apiKey = "my-secret-key";
      const headers = DEFAULT_HEADERS(apiKey);
      
      // Basic auth should be base64(apiKey:x)
      const expectedCredentials = Buffer.from(`${apiKey}:x`).toString("base64");
      expect(headers.Authorization).toBe(`Basic ${expectedCredentials}`);
    });
  });
});
