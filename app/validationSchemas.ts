import { z } from "zod";

export const createTaskBoardSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(25, "Maximum of 25 characters."),
  columns: z
    .array(
      z
        .string()
        .min(1, "Title is required when assigning columns to boards.")
        .max(15, "Maximum of 15 characters")
    )
    .optional(),
});

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(255, "Maximum of 255 characters."),
  description: z
    .string()
    .min(1, "Description is required")
    .max(255, "Maximum of 255 characters."),
  columnId: z.string(),
});
