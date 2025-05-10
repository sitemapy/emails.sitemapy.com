import { render } from "@react-email/render";
import GenericEmail from "../components/Generic";
import type { Campaign } from "../types/CampaignType";

export const renderText = (params: {
  i18n: any;
  language: string;
  content: Campaign;
  variables?: Record<string, string>;
}): string => {
  return render(
    <GenericEmail
      lang={params.language}
      content={params.content}
      messages={params.i18n}
      variables={params.variables ?? {}}
    />,
    { pretty: false, plainText: true }
  );
};
