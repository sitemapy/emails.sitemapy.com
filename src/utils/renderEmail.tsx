import { render } from "@react-email/render";
import GenericEmail from "../components/Generic";
import type { Campaign } from "../types/CampaignType";

export const renderEmail = (params: {
  content: Campaign;
  language: string;
  i18n: any;
  variables?: Record<string, string>;
}): string => {
  return render(
    <GenericEmail
      lang={params.language}
      content={params.content}
      messages={params.i18n}
      variables={params.variables ?? {}}
    />,
    { pretty: false }
  );
};
