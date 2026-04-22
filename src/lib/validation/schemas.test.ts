import {
  commentFormSchema,
  groupFormSchema,
  imageFormSchema,
  paletteFormSchema,
  tagFormSchema,
} from "@/lib/validation/schemas";

describe("form schemas", () => {
  it("validates required text fields", () => {
    expect(groupFormSchema.safeParse({ name: "Branding" }).success).toBe(true);
    expect(tagFormSchema.safeParse({ name: "Minimalista" }).success).toBe(true);
    expect(commentFormSchema.safeParse({ content: "Comentario relevante" }).success).toBe(true);

    expect(groupFormSchema.safeParse({ name: "   " }).success).toBe(false);
    expect(tagFormSchema.safeParse({ name: "   " }).success).toBe(false);
    expect(commentFormSchema.safeParse({ content: "   " }).success).toBe(false);
  });

  it("validates image title and URL", () => {
    expect(
      imageFormSchema.safeParse({
        title: "Imagem",
        imageUrl: "https://example.com/image.png",
        groupIds: [],
        tagIds: [],
      }).success,
    ).toBe(true);

    expect(
      imageFormSchema.safeParse({
        title: "Imagem",
        imageUrl: "not-a-url",
        groupIds: [],
        tagIds: [],
      }).success,
    ).toBe(false);
  });

  it("validates palette title and HEX colors", () => {
    expect(
      paletteFormSchema.safeParse({
        title: "Paleta",
        colorsText: "#FFFFFF, #123ABC",
        groupIds: [],
        tagIds: [],
      }).success,
    ).toBe(true);

    expect(
      paletteFormSchema.safeParse({
        title: "Paleta",
        colorsText: "#FFFFFF, azul",
        groupIds: [],
        tagIds: [],
      }).success,
    ).toBe(false);
  });

  it("validates palette color limit of 10", () => {
    const tenColors = Array.from({ length: 10 }, (_, i) => `#${i.toString(16).padStart(5, "0")}F`).join(", ");
    const elevenColors = Array.from({ length: 11 }, (_, i) => `#${i.toString(16).padStart(5, "0")}F`).join(", ");

    expect(
      paletteFormSchema.safeParse({
        title: "Paleta",
        colorsText: tenColors,
        groupIds: [],
        tagIds: [],
      }).success,
    ).toBe(true);

    expect(
      paletteFormSchema.safeParse({
        title: "Paleta",
        colorsText: elevenColors,
        groupIds: [],
        tagIds: [],
      }).success,
    ).toBe(false);
  });
});
