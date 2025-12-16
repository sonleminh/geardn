import 'server-only';
import { z } from 'zod';

const EnvSchema = z.object({
  BACKEND_API_URL: z.string().url(),
});

export const env = EnvSchema.parse({
  BACKEND_API_URL: process.env.BACKEND_API_URL,
});
