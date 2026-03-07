import { createRequest } from "../src/requests";
import { BASE_URL_PRODUCTION, BASE_URL_SANDBOX } from "../src/constants";

// Mock fetch globally
global.fetch = jest.fn();

describe("createRequest", () => {
  const apiKey = "test-api-key";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a request function", () => {
    const request = createRequest(apiKey);
    expect(typeof request).toBe("function");
  });

  it("should use production URL by default", async () => {
    const request = createRequest(apiKey);
    const mockData = { id: "123", status: "success" };
    const mockResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue(JSON.stringify(mockData)),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await request("/test", { method: "GET" });

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL_PRODUCTION}/test`,
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Basic /),
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("should use sandbox URL when environment is sandbox", async () => {
    const request = createRequest(apiKey, "sandbox");
    const mockData = { id: "123", status: "success" };
    const mockResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue(JSON.stringify(mockData)),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await request("/test", { method: "GET" });

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL_SANDBOX}/test`,
      expect.anything()
    );
  });

  it("should handle error responses", async () => {
    const request = createRequest(apiKey);
    const mockError = { message: "Error occurred" };
    const mockResponse = {
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue(JSON.stringify(mockError)),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(request("/test", { method: "GET" })).rejects.toThrow("Beehive Hub Error");
  });

  it("should handle empty response body (e.g. DELETE 204 No Content)", async () => {
    const request = createRequest(apiKey);
    const mockResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue(""),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await request("/payment-links/123", { method: "DELETE" });

    expect(result).toBeUndefined();
  });

  it("should handle network errors", async () => {
    const request = createRequest(apiKey);
    const networkError = new Error("Network error");
    (global.fetch as jest.Mock).mockRejectedValue(networkError);

    await expect(request("/test", { method: "GET" })).rejects.toThrow("Network error");
  });

  it("should merge custom headers with default headers", async () => {
    const request = createRequest(apiKey);
    const mockResponse = {
      ok: true,
      text: jest.fn().mockResolvedValue("{}"),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await request("/test", {
      method: "POST",
      headers: { "X-Custom-Header": "custom-value" },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL_PRODUCTION}/test`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Basic /),
          "Content-Type": "application/json",
          "X-Custom-Header": "custom-value",
        }),
      }),
    );
  });
});
