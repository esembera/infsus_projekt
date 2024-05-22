import { z } from "zod";
export const formSchema = z.object({
  selectedFileUrl: z.string().optional(),
  photoName: z.string().min(2, "Photo name is required."),
  description: z.string().optional(),
  photoDate: z.date({ message: "Date when the photo was taken is required." }),
  tags: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    )
    .optional(),
  photoType: z.enum(
    ["portrait", "landscape", "macro", "street", "screenshot"],
    { message: "Photo Type is required." }
  ),
});
