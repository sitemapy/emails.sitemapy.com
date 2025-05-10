import { z } from "zod";

export const getEnv = () => {
  const zodEnv = z.object({
    BREVO_API_KEY: z.string(),
    SENDER_EMAIL: z.string(),
    PRIVATE_ACCESS_KEY: z.string(),
    ORIGIN_URL: z.string(),
    NODE_ENV: z.string().default("development"),
  });
  const env = zodEnv.parse(process.env);
  return env;
};

export const getTranslateEnv = () => {
  const zodEnv = z.object({
    OPEN_AI_API_KEY: z.string(),
    OPEN_AI_ORGANIZATION: z.string(),
    OPEN_AI_PROJECT: z.string(),
  });

  const env = zodEnv.parse(process.env);

  return env;
};
