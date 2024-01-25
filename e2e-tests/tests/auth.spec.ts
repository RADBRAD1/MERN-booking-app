
import { test, expect } from '@playwright/test';


const UI_URL = "http://localhost:5179";


//{page}(basically the browser window) gets paseed by playwright framework into our test, then 
test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL); 

  //get the sign in button
  await page.getByRole("link", {name: "Sign In"}).click();

  await expect(page.getByRole("heading", { name: "Sign In"})).toBeVisible();


  await page.locator("[name = email]").fill("1@1.com");
  await page.locator("[name = password").fill("password");

  await page.getByRole("button", {name: "Login"}).click();

  //create assertions to prove that the user has logged in successfully, such as the toastify notification displaying, and displaying myhotels, mybookings

  await expect(page.getByText("Sign in Successful")).toBeVisible();
  await expect(page.getByRole("link",{name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link",{name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button",{name: "Sign Out"})).toBeVisible();



});



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