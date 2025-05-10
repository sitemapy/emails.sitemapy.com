import fs from "node:fs/promises";
import path from "node:path";
import {
  CMS_TEMPLATES_PATH,
  DEFAULT_LANGUAGE_IN_EMAILS,
  I18N_MESSAGES_PATH,
} from "../constants/constants";
import type { Campaign } from "../types/CampaignType";
import { renderEmail } from "./renderEmail";
import { renderText } from "./renderText";
import { getLanguagesAvailable } from "./getLanguagesAvailable";
import { getEnv } from "./getEnv";

export const getTemplate = async (params: {
  template: string;
  language: string;
}): Promise<Campaign> => {
  try {
    const messages = await fs.readFile(
      path.resolve(
        CMS_TEMPLATES_PATH,
        `${params.language}-${params.template}.json`
      ),
      "utf-8"
    );

    return JSON.parse(messages) as Campaign;
  } catch (error) {
    throw new Error(`Template ${params.template} not found`);
  }
};

const getI18n = async (params: { language: string }) => {
  const messages = await fs.readFile(
    path.resolve(I18N_MESSAGES_PATH, `${params.language}.json`),
    "utf-8"
  );

  return JSON.parse(messages);
};

const useDefautLanguageIfCurrentLanguageIsNotAvailable = async (params: {
  template: string;
  language: string;
}) => {
  const languagesAvailable = await getLanguagesAvailable(params);

  if (languagesAvailable.includes(params.language)) return params.language;

  return DEFAULT_LANGUAGE_IN_EMAILS;
};

export const getEmail = async (params: {
  template: string;
  language: string;
  variables?: Record<string, string>;
}) => {
  const language = await useDefautLanguageIfCurrentLanguageIsNotAvailable(
    params
  );
  const i18n = await getI18n({ ...params, language });
  const template = await getTemplate({ ...params, language });

  return {
    subject: template.subject,
    preview: template.preview,
    template: params.template,
    sender: {
      name: template.sender,
      email: getEnv().SENDER_EMAIL,
    },
    content: template,
    i18n,
    language: template.lang,
    html: renderEmail({
      content: template,
      i18n,
      language: template.lang,
      variables: params.variables,
    }),
    textContent: renderText({
      content: template,
      i18n,
      language: template.lang,
      variables: params.variables,
    }),
  };
};
