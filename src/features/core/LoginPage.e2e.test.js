import puppeteer from "puppeteer";

describe("Login Page", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({headless:false});
    page = await browser.newPage();
  });

  it("should show error message when email is empty", async () => {
    await page.goto("http://localhost:3000");

    await page.waitForSelector(".form_field_password");
    await page.click(".form_field_password");
    await page.type(".form_field_password", "admin");

    await page.click(".form_button_submit");

    await page.waitForSelector(".form_error_email");
    const email_error_message = await page.$eval(".form_error_email", (e) => e.textContent);
    expect(email_error_message).toContain(
      "Please provide only a TongYong corporate e-mail address"
    );
  });

  it("should show error message when email is not correct", async () => {
    await page.goto("http://localhost:3000");

    await page.waitForSelector(".form_field_email");
    await page.click(".form_field_email");
    await page.type(".form_field_email", "feixuan@123.com");

    await page.waitForSelector(".form_field_password");
    await page.click(".form_field_password");
    await page.type(".form_field_password", "admin");

    await page.click(".form_button_submit");

    await page.waitForSelector(".form_error_email");
    const email_error_message = await page.$eval(
      ".form_error_email",
      (e) => e.textContent
    );
    expect(email_error_message).toContain(
      "Please provide only a TongYong corporate e-mail address"
    );
    /*
     * page.waitForSelector() will wait for element till it appears or till timeout exceeds.
     * page.$(selector) will return the result immediately without waiting. If you sure that
     * the element should already be on the page, you can use page.$(selector) check,
     * otherwise page.waitForSelector() is safer.
     */
    let form_error_password_exists;
    try {
      await page.waitForSelector("form_error_password", { timeout: 1000 });
      form_error_password_exists = true;
    } catch (error) {
      form_error_password_exists = false;
    } finally {
      expect(form_error_password_exists).toBe(false);
    }
  });

  it("should show error message when password is empty", async () => {
    await page.goto("http://localhost:3000");

    await page.waitForSelector(".form_field_email");
    await page.click(".form_field_email");
    await page.type(".form_field_email", "feixuan@tongyong.com");

    await page.click(".form_button_submit");

    await page.waitForSelector(".form_error_password");
    const password_error_message = await page.$eval(".form_error_password", (e) => e.textContent);
    expect(password_error_message).toContain("password is required");
  });

  it("should show error message when password is not correct", async () => {
    await page.goto("http://localhost:3000");

    await page.waitForSelector(".form_field_email");
    await page.click(".form_field_email");
    await page.type(".form_field_email", "feixuan@tongyong.com");

    await page.waitForSelector(".form_field_password");
    await page.click(".form_field_password");
    await page.type(".form_field_password", "123");

    await page.click(".form_button_submit");

    await page.waitForSelector(".global-error");
    const global_error_message = await page.$eval(".global-error", (e) => e.textContent);
    expect(global_error_message).toContain("email or password incorrect");
  });

  it("should show error message when email and password are empty", async () => {
    await page.goto("http://localhost:3000");

    await page.click(".form_button_submit");

    await page.waitForSelector(".form_error_email");
    const email_error_message = await page.$eval(".form_error_email", (e) => e.textContent);
    expect(email_error_message).toContain(
      "Please provide only a TongYong corporate e-mail address"
    );

    await page.waitForSelector(".form_error_password");
    const password_error_message = await page.$eval(".form_error_password", (e) => e.textContent);
    expect(password_error_message).toContain("password is required");
  });

  it("should jump to profile page when email and password are right", async () => {
    await page.goto("http://localhost:3000");

    await page.waitForSelector(".form_field_email");
    await page.click(".form_field_email");
    await page.type(".form_field_email", "feixuan@tongyong.com");

    await page.waitForSelector(".form_field_password");
    await page.click(".form_field_password");
    await page.type(".form_field_password", "admin");

    await page.click(".form_button_submit");

    await page.waitForSelector(".employee_name");
    const employee_name = await page.$eval(".employee_name", (e) => e.textContent);
    expect(employee_name).toContain("Fei Xuan");
  });

  afterAll(() => browser.close());
});
