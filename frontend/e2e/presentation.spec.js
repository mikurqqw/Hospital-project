import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("registration, authenticated AI flows, accessibility and responsive themes", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem("i18nextLng", "ru"));
  await page.goto("/");
  await page.getByRole("button", { name: "Регистрация", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("ФИО").fill("Demo Presenter");
  await dialog.getByLabel("Email").fill(`demo-${Date.now()}@example.com`);
  await dialog.getByLabel("Пароль").fill("presentation-123");
  await dialog.getByRole("button", { name: "Регистрация", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("token"))).toBeNull();
  await page.route("**/api/chat/history", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    await route.fulfill({status:200, contentType:"application/json", body:"[]"});
  });
  await page.getByRole("button", { name: /AI Консультант/ }).click();
  await expect(page).toHaveURL(/\/chat$/);
  await expect(page.getByLabel("Сообщение", { exact: true })).toBeDisabled();
  await page.route("**/api/chat/message", (route) => route.fulfill({
    status: 200, contentType: "text/plain", body: "Учебный ответ Gemini. Обратитесь к врачу.",
  }));
  await page.getByLabel("Сообщение", { exact: true }).fill("Как улучшить режим сна?");
  await page.getByRole("button", { name: "Отправить сообщение" }).click();
  await expect(page.getByText("Учебный ответ Gemini. Обратитесь к врачу.", { exact: true })).toBeVisible();
  await page.route("**/api/chat/message", (route) => route.fulfill({
    status: 429, contentType: "application/json", body: JSON.stringify({detail: "Лимит бесплатного ИИ исчерпан"}),
  }));
  await page.getByLabel("Сообщение", { exact: true }).fill("Ещё вопрос");
  await page.getByRole("button", { name: "Отправить сообщение" }).click();
  await expect(page.getByText(/Лимит бесплатного ИИ исчерпан/)).toBeVisible();
  const findings = [];
  for (const theme of ["light", "dark"]) {
    for (const route of ["/", "/chat", "/diagnostics", "/symptoms"]) {
      await page.getByRole("link", {name:"AI Health", exact:true}).click();
      if (route !== "/") {
        const names = {"/chat": /AI Консультант/, "/diagnostics": /AI Диагностика/, "/symptoms": /Чекер симптомов/};
        await page.getByRole("button", {name:names[route]}).click();
      }
      await expect(page).toHaveURL(new RegExp(route === "/" ? "/$" : `${route}$`));
      await page.evaluate((theme) => document.documentElement.classList.toggle("dark", theme === "dark"), theme);
      await page.waitForTimeout(1800);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      for (const item of results.violations) findings.push({theme,route,id:item.id,impact:item.impact,nodes:item.nodes.map((node)=>node.target)});
      for (const width of [375, 768, 1280, 1920]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.waitForTimeout(100);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.screenshot({path:`../artifacts/screenshots/${route.replaceAll("/", "") || "home"}-${width}-${theme}.png`});
      }
    }
  }
  expect(findings).toEqual([]);
  expect(errors).toEqual([]);
});
