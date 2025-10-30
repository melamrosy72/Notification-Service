import { z } from "zod";

export const registerTokenSchema = z.object({
  token: z.string().nonempty(),
  deviceId: z.string(),
  deviceInfo: z.object({
    platform: z.enum(["ios", "android", "web"]),
    model: z.string().optional(),
    brand: z.string().optional(),
    version: z.string().optional(),
  }),
});

export const sendNotificationSchema = z.object({
  deviceId: z.string(),
  title: z.string().min(1),
  body: z.string().min(1),
  data: z.record(z.string(), z.any()).optional(),
});

export const sendAllNotificationSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  data: z.record(z.string(), z.any()).optional(),
});
