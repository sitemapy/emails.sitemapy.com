import { readdir } from "fs/promises";
import path from "node:path";

export const getLanguagesAvailable = async (params: { template: string }) => {
  const files = await readdir(path.resolve("src/public/cms/campaigns"));

  const keepOnlyFilesWithTemplateName = files.filter((filename) =>
    filename.includes(params.template)
  );
  const removeExtensionAndKeepOnlyLanguage = keepOnlyFilesWithTemplateName.map(
    (filename) => filename.split("-")[0]
  );

  return removeExtensionAndKeepOnlyLanguage;
};
