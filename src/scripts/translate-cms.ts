import fs from "node:fs";
import path from "node:path";
import type { CampaignContent } from "../types/CampaignType";
import { getTranslateEnv } from "../utils/getEnv";

const languagesAvailable = [
  "en",
  "fr",
  "pt",
  "es",
  "it",
  "ko",
  "ru",
  "tr",
  "de",
];

const openaiTranslate = async (params: {
  text: string;
  lang: string;
  from: string;
}) => {
  const data = JSON.stringify({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a translator. I'll give you sentences that you have to translate into the lang I submit.

        For example, if I give you from: fr, to: en, you have to translate from french to english.

        If you translate into korean, please only write in korean and no english words.

        Do not translate those words: Sitemapy.

        Keep links in the text, but translate the link text. But not the url.
        
        Give me only the translation.`,
      },
      {
        role: "user",
        content: `from:${params.from}, to:${params.lang}
        
        ${params.text}`,
      },
    ],
    temperature: 0,
  });

  const config: RequestInit = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTranslateEnv().OPEN_AI_API_KEY}`,
      "OpenAI-Organization": getTranslateEnv().OPEN_AI_ORGANIZATION,
      "OpenAI-Project": getTranslateEnv().OPEN_AI_PROJECT,
    },
    body: data,
  };

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    config
  );

  const json = (await response.json()) as {
    choices: [{ message: { content: string } }];
  };

  return json.choices.map(({ message }) => message.content).join("");
};

const translate = async (params: {
  text: string;
  lang: string;
  from: string;
}) => {
  return openaiTranslate(params);
};

const translateArticle = async (params: { article: any; lang: string }) => {
  const article = params.article;

  const translated = {
    ...article,
    lang: params.lang.toLowerCase(),
    subject: await translate({
      text: article.subject,
      lang: params.lang,
      from: article.lang,
    }),
    sender: await translate({
      text: article.sender,
      lang: params.lang,
      from: article.lang,
    }),
    preview: await translate({
      text: article.preview,
      lang: params.lang,
      from: article.lang,
    }),
    content: await Promise.all(
      article.content.map(async (content: CampaignContent) => {
        if (content.type === "paragraph") {
          return {
            ...content,
            value: await translate({
              text: content.value,
              lang: params.lang,
              from: article.lang,
            }),
          };
        }

        if (content.type === "title") {
          return {
            ...content,
            value: await translate({
              text: content.value,
              lang: params.lang,
              from: article.lang,
            }),
          };
        }

        if (content.type === "pricing") {
          return {
            ...content,
            name: await translate({
              text: content.name,
              lang: params.lang,
              from: article.lang,
            }),
            interval: await translate({
              text: content.interval,
              lang: params.lang,
              from: article.lang,
            }),
            features: await Promise.all(
              content.features.map((feature) => {
                return translate({
                  text: feature,
                  lang: params.lang,
                  from: article.lang,
                });
              })
            ),
            button: {
              ...content.button,
              label: await translate({
                text: content.button.label,
                lang: params.lang,
                from: article.lang,
              }),
            },
          };
        }

        if (content.type === "quote") {
          return {
            ...content,
            description: await translate({
              text: content.description,
              lang: params.lang,
              from: article.lang,
            }),
            title: await translate({
              text: content.title,
              lang: params.lang,
              from: article.lang,
            }),
          };
        }

        if (content.type === "button") {
          return {
            ...content,
            value: await translate({
              text: content.value,
              lang: params.lang,
              from: article.lang,
            }),
          };
        }

        return content;
      })
    ),
  };

  return translated;
};

const campaign = async (params: { target: string; file: string }) => {
  const article: any = JSON.parse(
    fs.readFileSync(
      path.resolve("src/public/cms/campaigns", params.file),
      "utf-8"
    )
  );

  const translated = await translateArticle({
    article,
    lang: params.target,
  });

  const articleTranslated: any = {
    ...translated,
  };

  const filename = `${params.target.toLowerCase()}-${articleTranslated.id}`;

  fs.writeFileSync(
    path.resolve("src/public/cms/campaigns", filename + ".json"),
    JSON.stringify(articleTranslated)
  );
};

async function run() {
  for (const language of languagesAvailable.filter((lang) => lang !== "en")) {
    console.log(language);

    await campaign({
      target: language,
      file: "en-forgot-password.json",
    });
  }
}

run();
