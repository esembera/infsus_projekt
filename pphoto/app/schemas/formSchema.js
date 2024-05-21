import { z } from "zod"
export const formSchema = z.object({
  selectedFile: z.instanceof(File),
  photoName: z.string().min(2, "Photo name is required"),
  description: z.string().optional(),
  photoDate: z.date(),
  tags: z.array(z.object({
    id: z.string(),
    text: z.string()
  })).optional(),
  photoType: z.enum(["portrait", "landscape", "macro", "street", "screenshot"])
});