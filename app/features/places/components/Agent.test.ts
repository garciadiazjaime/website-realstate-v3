import { getPlaceIds } from "./Agent";

jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn(),
}));

jest.mock("marked", () => ({
  marked: jest.fn(() => "<p>Mocked HTML</p>"),
}));

describe("getPlaceIds", () => {
  it("should extract Place IDs when `<code>Place ID</code>: 12412646`", () => {
    const aiResponse = `<li><code>Place ID</code>: 12412646, <code>Address</code>: 2158 W Giddings St #1, <code>Price</code>: 375000, <code>Beds</code>: 2, <code>Baths</code>: 1, <code>Square Feet</code>: null</li>\n`;

    const result = getPlaceIds(aiResponse);
    expect(result).toEqual([12412646]);
  });

  it("should extract Place IDs when `<code>Place ID: 12405636</code>`", () => {
    const aiResponse = `<li><p><strong>Largest Square Footage:</strong> <code>Place ID: 12405636</code>, Address: 3312 W Beach Ave #1, Price: $289,900, Square Feet: 1800. Excellent space for the price.</p>`;

    const result = getPlaceIds(aiResponse);
    expect(result).toEqual([12405636]);
  });

  it("should extract Place Ids when `<strong>Place ID</strong>: 12392835`", () => {
    const aiResponse = `<li><p><strong>Place ID</strong>: 12392835</p>`;

    const result = getPlaceIds(aiResponse);
    expect(result).toEqual([12392835]);
  });

  it("should extract Place IDs when `Place ID: 108083`", () => {
    const aiResponse = `<li><p><strong>Highest Bathrooms Number:</strong> Place ID: 108083, Address: 156 Morgan's Gate Dr Unit 17-2, Price: 335000, Beds: 2, Baths: 2.5, Square Feet: 1721, Zip Code: 60191</p></li>`;

    const result = getPlaceIds(aiResponse);
    expect(result).toEqual([108083]);
  });
});
