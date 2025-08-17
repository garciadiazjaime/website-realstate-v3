import { getPlaceIds } from "./Agent";

jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn(),
}));

jest.mock("marked", () => ({
  marked: jest.fn(() => "<p>Mocked HTML</p>"),
}));

describe("getPlaceIds", () => {
  it("should extract Place IDs when using <code>", () => {
    const aiResponse = `'<li><code>Place ID</code>: 12412646, <code>Address</code>: 2158 W Giddings St #1, <code>Price</code>: 375000, <code>Beds</code>: 2, <code>Baths</code>: 1, <code>Square Feet</code>: null</li>\n'`;

    const result = getPlaceIds(aiResponse);
    expect(result).toEqual([12412646]);
  });

  it("should extract Place Ids when using <strong>", () => {
    const aiResponse = `<li><p><strong>Place ID</strong>: 12392835</p>`;

    const result = getPlaceIds(aiResponse);
    expect(result).toEqual([12392835]);
  });
});
