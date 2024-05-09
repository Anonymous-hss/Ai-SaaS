import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Image Prompt is required",
  }),
  amount: z.string().min(1),
  resolution: z.string().min(1),
});

export const amountOptions = [
  {
    value: "1",
    lable: "1 Photo",
  },
  {
    value: "2",
    lable: "2 Photo",
  },
  {
    value: "3",
    lable: "3 Photo",
  },
  {
    value: "4",
    lable: "4 Photo",
  },
  {
    value: "5",
    lable: "5 Photo",
  },
];

export const resolutionOption = [
  {
    value: "256x256",
    label: "256x256",
  },
  {
    value: "512x512",
    label: "512x512",
  },
  {
    value: "1024x1024",
    label: "1024x1024",
  },
];
