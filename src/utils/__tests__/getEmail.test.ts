import { expect, test } from "bun:test";
import { getEmail } from "../getEmail";

test("should find a template and return an email", async () => {
  const email = await getEmail({ template: "welcome", language: "en" });

  expect(email).toBeDefined();
  expect(email.language).toEqual("en");
  expect(email.template).toEqual("welcome");
});
