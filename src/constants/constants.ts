import path from "node:path";

export const PUBLIC_PATH = path.resolve(__dirname, "../public/");

export const CMS_PATH = path.resolve(PUBLIC_PATH, "cms");
export const CMS_TEMPLATES_PATH = path.resolve(CMS_PATH, "campaigns");

export const I18N_PATH = path.resolve(__dirname, "../i18n/");
export const I18N_MESSAGES_PATH = path.resolve(__dirname, "../i18n/messages");

export const DEFAULT_LANGUAGE_IN_EMAILS = "en";
