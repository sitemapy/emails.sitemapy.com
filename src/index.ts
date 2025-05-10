import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import fs from "fs/promises";
import { sendEmail } from "./utils/sendEmail";
import { getEmail, getTemplate } from "./utils/getEmail";
import { CMS_TEMPLATES_PATH, PUBLIC_PATH } from "./constants/constants";
import { StatusCodes } from "http-status-codes";
import zod from "zod";
import { validateBody, validateQuery } from "./middlewares/validator";
import { ShowEmailTemplateDto, SendEmailsDto } from "./middlewares/dto";
import { getEnv } from "./utils/getEnv";

const app = express();
app.use(express.json());
app.use("/public", express.static(PUBLIC_PATH));

app.get("/", async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    ip: req.ip,
    headers: req.headers,
    method: req.method,
    path: req.path,
    query: req.query,
  });
});

app.get(
  "/emails",
  validateQuery(ShowEmailTemplateDto),
  async (req: Request, res: Response) => {
    const queryParams = req.query as zod.infer<typeof ShowEmailTemplateDto>;
    const email = await getEmail(queryParams);

    res
      .status(StatusCodes.OK)
      .header("Content-Type", "text/html; charset=utf-8")
      .send(email.html);
  }
);

function apiKeyProtectedRoute(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== getEnv().PRIVATE_ACCESS_KEY) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      error: "Unauthorized",
      message: "you are not authorized to access this api",
    });
  }
  next();
}

const doesTemplateExist = async (params: {
  template: string;
  language: string;
}) => {
  try {
    await getTemplate(params);
    return true;
  } catch (error) {
    return false;
  }
};

const getTemplatesAvailable = async () => {
  const templates = await fs.readdir(CMS_TEMPLATES_PATH);
  return templates.map((template) => template.split(".")[0]);
};

app.post(
  "/emails",
  apiKeyProtectedRoute,
  validateBody(SendEmailsDto),
  async (req: Request, res: Response) => {
    const requestBody = req.body as zod.infer<typeof SendEmailsDto>;

    if (!(await doesTemplateExist(requestBody))) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .header("Content-Type", "application/json; charset=utf-8")
        .send({
          error: "Template not found",
          details: {
            template_requested: requestBody.template,
            templates_available: await getTemplatesAvailable(),
          },
        });
    }

    const email = await getEmail(requestBody);

    const response = await sendEmail({
      html: email.html,
      textContent: email.textContent,
      sender: email.sender,
      tags: [email.language, email.template],
      subject: email.subject,
      to: Array.isArray(requestBody.to) ? requestBody.to : [requestBody.to],
    });

    if (response.error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .header("Content-Type", "application/json; charset=utf-8")
        .send({
          params: requestBody,
          error: response.body,
        });
    }

    res.status(StatusCodes.OK).json({
      success: true,
    });
  }
);

const port = Number(process.env.PORT || 8080);
const host = process.env.HOST || "localhost";

app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
