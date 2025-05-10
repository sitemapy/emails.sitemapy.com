import { expect, test } from "bun:test";
import { doesTemplateExists } from "../doesTemplateExists";

test("should return true if the template exists", async () => {
  const doesExists = await doesTemplateExists({ template: "welcome" });

  expect(doesExists).toEqual(true);
});

test("should return false if the template does not exists", async () => {
  const doesExists = await doesTemplateExists({ template: "not-exist" });

  expect(doesExists).toEqual(false);
});
