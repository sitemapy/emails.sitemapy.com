import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

import ReactMardown, { type ReactNode } from "react-markdown";
import * as en from "../i18n/messages/en.json";
import { clsx } from "clsx";
import type { Campaign } from "../types/CampaignType";
import { Pricing } from "./atoms/Pricing";
import { getEnv } from "../utils/getEnv";

const isProduction = getEnv().NODE_ENV === "production";

const FooterLink: React.FC<{ href: string; children: ReactNode }> = (props) => {
  return (
    <div className="py-1">
      <Link className="no-underline text-slate-900 font-bold" href={props.href}>
        {props.children}
      </Link>
    </div>
  );
};

const render_with_variables = (props: {
  value: string;
  variables: Record<string, string>;
}) => {
  return Object.entries(props.variables).reduce((acc, [key, value]) => {
    return acc.replace(`{{${key}}}`, value);
  }, props.value);
};

export const GenericEmail: React.FC<{
  lang: string;
  content: {
    preview: string;
    content: Campaign["content"];
  };
  variables: Record<string, string>;
  messages: typeof en;
}> = (props) => {
  const messages = props.messages || en;
  const content = props.content;

  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>{content.preview}</Preview>

        <Body style={main}>
          <Container className="p-4">
            <Img
              src={`${getEnv().ORIGIN_URL}/public/cms/uploads/logo.png`}
              width={48}
              height={48}
              alt="Logo"
              className="my-0 mx-auto"
            />

            {content.content.map((content, index: number) => {
              if (content.type === "paragraph")
                return (
                  <ReactMardown
                    key={index}
                    components={{
                      p: (props) => <Text {...props} className={"text-base"} />,
                    }}
                  >
                    {render_with_variables({
                      value: content.value as string,
                      variables: props.variables,
                    })}
                  </ReactMardown>
                );

              if (content.type === "pricing") {
                return <Pricing key={index} {...content} />;
              }

              if (content.type === "quote")
                return (
                  <div
                    key={index}
                    className={clsx(
                      `rounded p-6 border-l-4 border-transparent border-solid my-4`,
                      content.theme === "pink" &&
                        "bg-pink-50 text-pink-900 border-l-pink-900",
                      content.theme === "blue" &&
                        "bg-blue-50 text-blue-900 border-l-blue-900",
                      content.theme === "emerald" &&
                        "bg-emerald-50 text-emerald-900 border-l-emerald-900",
                      content.theme === "orange" &&
                        "bg-orange-50 text-orange-900 border-l-orange-900"
                    )}
                  >
                    <div className="font-bold text-xl">{content.title}</div>
                    <ReactMardown
                      components={{
                        p: (props) => (
                          <Text {...props} className={"text-base"} />
                        ),
                      }}
                    >
                      {render_with_variables({
                        value: content.description as string,
                        variables: props.variables,
                      })}
                    </ReactMardown>
                  </div>
                );

              if (content.type === "button") {
                return (
                  <Button
                    key={index}
                    href={render_with_variables({
                      value: content.href as string,
                      variables: props.variables,
                    })}
                    className="mt-4 px-4 py-2 rounded bg-slate-900 text-white"
                  >
                    {render_with_variables({
                      value: content.value as string,
                      variables: props.variables,
                    })}
                  </Button>
                );
              }

              if (content.type === "title")
                return (
                  <Heading key={index} className="mt-12 text-3xl">
                    {render_with_variables({
                      value: content.value as string,
                      variables: props.variables,
                    })}
                  </Heading>
                );

              if (content.type === "image") {
                const src = isProduction
                  ? `${getEnv().ORIGIN_URL}${content.src}`
                  : content.src;

                return <Img key={index} className="w-full" src={src} />;
              }

              if (content.type === "separator")
                return <Hr style={hr} key={index} />;

              return <></>;
            })}
          </Container>

          <div className="mt-12 border-t text-center text-sm border-slate-100 bg-slate-50">
            <div className="py-16">
              <Img
                src={`${getEnv().ORIGIN_URL}/public/cms/uploads/logo.png`}
                width={48}
                height={48}
                alt="logo"
                className="my-0 mx-auto"
              />

              <Container className="mt-8">
                <div className="mt-8">
                  <FooterLink href="{{ unsubscribe }}">
                    {messages["unsubscribe"]}
                  </FooterLink>
                </div>
              </Container>
            </div>
          </div>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default GenericEmail;

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
