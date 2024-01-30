
import { test, expect } from '@playwright/test';


const UI_URL = "http://localhost:5179";


//{page}(basically the browser window) gets paseed by playwright framework into our test, then 
test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL); 

  //get the sign in button
  await page.getByRole("link", {name: "Sign In"}).click();

  await expect(page.getByRole("heading", { name: "Sign In"})).toBeVisible();


  await page.locator("[name = email]").fill("1@1.com");
  await page.locator("[name = password").fill("password123");

  await page.getByRole("button", {name: "Login"}).click();

  //create assertions to prove that the user has logged in successfully, such as the toastify notification displaying, and displaying myhotels, mybookings

  await expect(page.getByText("Sign in Successful")).toBeVisible();
  await expect(page.getByRole("link",{name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link",{name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button",{name: "Sign Out"})).toBeVisible();



});

test("should allow user to register", async ({page})=> {

  const testEmail = `test_register${Math.floor(Math.random()*90000)+ 10000}@test.com` //every time we run test, we should have a new unique user generated
  await page.goto(UI_URL);
  
  await page.getByRole("link",{name: "Sign In"}).click();
  await page.getByRole("link",{name: "Create an account here"}).click();
  
  //because this is an assertion, wrap the desired statement with an expect()
  await expect(page.getByRole("heading",{name: "Create an Account"})).toBeVisible();

  await page.locator("[name = firstName]").fill("test_firstName");
  await page.locator("[name = lastName]").fill("test_lastName");
  await page.locator("[name = email]").fill("test_register@test.com");
  await page.locator("[name = password]").fill("password123");
  await page.locator("[name = confirmPassword]").fill("password123");


  await page.getByRole("button",{name: "Create Account"}).click();

  await expect(page.getByText("Registration Success!")).toBeVisible();
  await expect(page.getByRole("link",{name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link",{name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button",{name: "Sign Out"})).toBeVisible();



}

);

/*
default test from playwright, good framework to use for our hotel booking app
create tests for login and sign up features.
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
}); 

-------
test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});


*/ 