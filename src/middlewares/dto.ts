import { z } from "zod";

import path from "path";
import fs from "fs";
import { CMS_TEMPLATES_PATH } from "../constants/constants";
import { uniq } from "ramda";

const templates = fs.readdirSync(CMS_TEMPLATES_PATH);
const filesInEnglish = templates.filter((file) => file.endsWith(".json"));
const campaignIds: string[] = filesInEnglish.map((file) => {
  const json = JSON.parse(
    fs.readFileSync(path.resolve(CMS_TEMPLATES_PATH, file), "utf-8")
  );

  return json.id as string;
});

export const EmailTemplates = z.enum(
  uniq(campaignIds) as [string, ...string[]]
);

export const SendEmailsDto = z.object({
  template: z.string(),
  language: z.string(),
  to: z
    .object({ email: z.string() })
    .or(z.array(z.object({ email: z.string() }))),
  variables: z.record(z.string()).optional(),
});

export const ShowEmailTemplateDto = z.object({
  template: z.string(),
  language: z.string(),
  variables: z.record(z.string()).optional(),
});
