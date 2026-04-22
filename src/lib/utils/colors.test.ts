import { isValidHexColor, normalizeHexColor, parseHexColors } from "@/lib/utils/colors";

describe("color utils", () => {
  it("normalizes HEX colors", () => {
    expect(normalizeHexColor("fff")).toBe("#FFF");
    expect(normalizeHexColor(" #abc123 ")).toBe("#ABC123");
  });

  it("validates HEX colors", () => {
    expect(isValidHexColor("#FFF")).toBe(true);
    expect(isValidHexColor("ABC123")).toBe(true);
    expect(isValidHexColor("#GGG")).toBe(false);
  });

  it("parses comma, semicolon and newline separated colors", () => {
    expect(parseHexColors("#fff, 123456\n#ABC; #000")).toEqual(["#FFF", "#123456", "#ABC", "#000"]);
  });
});
