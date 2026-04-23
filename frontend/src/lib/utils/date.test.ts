import { createIsoDate, formatAbsoluteDate, formatRelativeDate } from "@/lib/utils/date";

describe("createIsoDate", () => {
  it("returns a valid ISO string", () => {
    const iso = createIsoDate();
    expect(new Date(iso).toISOString()).toBe(iso);
  });
});

describe("formatRelativeDate", () => {
  it('returns "Agora" for very recent dates', () => {
    const now = new Date().toISOString();
    expect(formatRelativeDate(now)).toBe("Agora");
  });

  it("returns minutes for recent dates", () => {
    const date = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeDate(date)).toBe("Há 5 min");
  });

  it("returns hours for dates within the day", () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(date)).toBe("Há 3 h");
  });

  it('returns "Ontem" for yesterday', () => {
    const date = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(date)).toBe("Ontem");
  });

  it("returns days for dates within a week", () => {
    const date = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(date)).toBe("Há 4 dias");
  });

  it("returns formatted date for older dates", () => {
    const date = new Date("2024-01-15T10:00:00.000Z").toISOString();
    expect(formatRelativeDate(date)).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});

describe("formatAbsoluteDate", () => {
  it("returns a formatted date with time", () => {
    const date = new Date("2024-06-20T14:30:00.000Z").toISOString();
    const result = formatAbsoluteDate(date);
    expect(result).toContain("20/06/2024");
    expect(result).toContain(":");
  });
});
