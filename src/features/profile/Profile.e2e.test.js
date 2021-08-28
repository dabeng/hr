import puppeteer from "puppeteer";

describe("Profile Page", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000");

    await page.waitForSelector('[data-testid="field_email"]');
    await page.click('[data-testid="field_email"]');
    await page.type('[data-testid="field_email"]', "feixuan@tongyong.com");

    await page.waitForSelector('[data-testid="field_password"]');
    await page.click('[data-testid="field_password"]');
    await page.type('[data-testid="field_password"]', "admin");

    await page.click('[data-testid="button_submit"]');
  });

  it("should load basic infomation of employee", async () => {
    await page.waitForSelector('[data-testid="employee_name"]');
    const employee_name = await page.$eval('[data-testid="employee_name"]', (e) => e.textContent);
    expect(employee_name).toContain("Fei Xuan");
  });

  afterAll(() => browser.close());
});
