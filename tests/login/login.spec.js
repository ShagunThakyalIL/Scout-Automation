import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page.js";
import config from "../../config/base.config.js";

test("Login with valid credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto(config.baseURL);
  const result = await loginPage.login(
    config.credentials.username,
    config.credentials.password
  );
  expect(result).toBeTruthy();
});

test("Login with invalid email and valid password", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto(config.baseURL);
  const result = await loginPage.login(
    "invalid@gmail",
    config.credentials.password
  );
  expect(result).toBeFalsy();
});

test("Login with valid email and invalid password", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto(config.baseURL);
  const result = await loginPage.login(
    config.credentials.username,
    "invalid-password"
  );
  expect(result).toBeFalsy();
});

test("Login with invalid credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto(config.baseURL);
  const result = await loginPage.login("invalid@gmail", "invalid-password");
  expect(result).toBeFalsy();
});
