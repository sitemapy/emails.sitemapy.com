import { expect, test } from "bun:test";
import { CMS_PATH, CMS_TEMPLATES_PATH, PUBLIC_PATH } from "../constants";
import fs from "node:fs/promises";

test("should the public folder exists", async () => {
  expect(await fs.exists(PUBLIC_PATH)).toEqual(true);
});

test("should the cms folder exists", async () => {
  expect(await fs.exists(CMS_PATH)).toEqual(true);
});

test("should the cms templates folder exists", async () => {
  expect(await fs.exists(CMS_TEMPLATES_PATH)).toEqual(true);
});
