import { TransactionalEmailsApi } from "sib-api-v3-typescript";
import { getEnv } from "./getEnv";

const apiInstance = new TransactionalEmailsApi();
// @ts-ignore
const apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = getEnv().BREVO_API_KEY;

export const sendEmail = async (params: {
  subject: string;
  html: string;
  sender: { name: string; email: string };
  textContent: string;
  tags: string[];
  to: { email: string }[];
}): Promise<{ error: false } | { error: true; body: any }> => {
  try {
    await apiInstance.sendTransacEmail({
      subject: params.subject,
      htmlContent: params.html,
      sender: params.sender,
      to: params.to,
      textContent: params.textContent,
      tags: params.tags,
    });

    return { error: false };
  } catch (error: any) {
    console.error(error.response);

    return { error: true, body: error.response };
  }
};
