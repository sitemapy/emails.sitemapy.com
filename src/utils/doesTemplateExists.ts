import { readdir } from "node:fs/promises";
import { CMS_TEMPLATES_PATH } from "../constants/constants";

export const doesTemplateExists = async (params: {
  template: string;
}): Promise<boolean> => {
  const files = await readdir(CMS_TEMPLATES_PATH);

  const doesFilesIncludeTemplate = files.find((filename) =>
    filename.includes(`${params.template}.json`)
  );

  return Boolean(doesFilesIncludeTemplate);
};
