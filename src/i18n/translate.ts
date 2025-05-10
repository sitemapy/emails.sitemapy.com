import { promises as fs } from "fs";
import path from "path";
import { prop, groupBy } from "ramda";

function getDatabaseDirectory() {
  return path.resolve(__dirname, "translations.tsv");
}

async function getDatabase(): Promise<string[][]> {
  const dir = getDatabaseDirectory();
  const file = await fs.readFile(dir, "utf-8");
  return file.split("\n").map((line) => line.replace("\r", "").split("\t"));
}

function parseTsv(tsv: string[][]) {
  const [headers, ...lines] = tsv;
  const [, ...langs] = headers;
  const fields: { id: string; lang: string; value: string }[] = [];

  lines.forEach((line) => {
    langs.forEach((lang, index) => {
      fields.push({
        id: line[0],
        lang,
        value: line[index + 1],
      });
    });
  });

  return fields;
}

async function storeFile(json: any, lang: string) {
  const dir = path.resolve("src/i18n/messages/", `${lang}.json`);
  await fs.writeFile(dir, JSON.stringify(json), "utf-8");
}

async function main() {
  const tsv = await getDatabase();
  const langs = parseTsv(tsv);
  const groupByLang = groupBy(prop("lang"), langs);
  const keys = Object.keys(groupByLang);
  const translations = keys.map((lang) => ({
    lang,
    file: groupByLang[lang]!.reduce(
      (accumulator, translation) => ({
        ...accumulator,
        [translation.id]: translation.value,
      }),
      {}
    ),
  }));

  translations.forEach((translation) => {
    storeFile(translation.file, translation.lang);
  });
}

main();
