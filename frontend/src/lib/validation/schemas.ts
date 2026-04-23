import { z } from "zod";
import { HEX_COLOR_PATTERN, normalizeHexColor, parseHexColors } from "@/lib/utils/colors";

const requiredText = z.string().trim().min(1, "Campo obrigatório.");

export const groupFormSchema = z.object({
  name: requiredText,
});

export const tagFormSchema = z.object({
  name: requiredText,
});

export const commentFormSchema = z.object({
  content: requiredText,
});

export const imageFormSchema = z.object({
  title: requiredText,
  imageUrl: z.string().trim().url("Informe uma URL válida."),
  groupIds: z.array(z.string()),
  tagIds: z.array(z.string()),
});

const MAX_PALETTE_COLORS = 10;

export const paletteFormSchema = z.object({
  title: requiredText,
  colorsText: z
    .string()
    .trim()
    .min(1, "Informe pelo menos uma cor.")
    .refine(
      (value) => parseHexColors(value).every((color) => HEX_COLOR_PATTERN.test(normalizeHexColor(color))),
      "Use cores HEX válidas.",
    )
    .refine(
      (value) => parseHexColors(value).length <= MAX_PALETTE_COLORS,
      `Limite de ${MAX_PALETTE_COLORS} cores por paleta.`,
    ),
  groupIds: z.array(z.string()),
  tagIds: z.array(z.string()),
});

export type GroupFormValues = z.infer<typeof groupFormSchema>;
export type TagFormValues = z.infer<typeof tagFormSchema>;
export type CommentFormValues = z.infer<typeof commentFormSchema>;
export type ImageFormValues = z.infer<typeof imageFormSchema>;
export type PaletteFormValues = z.infer<typeof paletteFormSchema>;
