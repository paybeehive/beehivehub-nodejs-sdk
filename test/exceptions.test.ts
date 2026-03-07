import { BeehiveHubError } from "../src/exceptions";
import { BEEHIVE_DOCS } from "../src/constants";

describe("BeehiveHubError", () => {
  it("should create an error with the correct message", () => {
    const errorMessage = "Test error message";
    const error = new BeehiveHubError(errorMessage);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("BeehiveHubError");
    expect(error.message).toContain(errorMessage);
    expect(error.message).toContain(BEEHIVE_DOCS);
  });

  it("should serialize to JSON correctly", () => {
    const errorMessage = "Test error message";
    const error = new BeehiveHubError(errorMessage);
    const json = error.toJSON();

    expect(json).toHaveProperty("name", "BeehiveHubError");
    expect(json).toHaveProperty("message");
    expect(json.message).toContain(errorMessage);
  });
});
