import { expect, test } from "bun:test";
import { getLanguagesAvailable } from "../getLanguagesAvailable";

test("should get all languages from the template welcome", async () => {
  const languages = await getLanguagesAvailable({ template: "welcome" });

  expect(languages).toBeArray();
  expect(languages).toContain("en");
  expect(languages).toContain("fr");
});

test("should return an empty array if no template found", async () => {
  const languages = await getLanguagesAvailable({ template: "not-exist" });

  expect(languages).toBeArray();
  expect(languages).toBeEmpty();
});
