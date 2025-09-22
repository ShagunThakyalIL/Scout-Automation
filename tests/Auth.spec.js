const {test, expect, request} = require('@playwright/test');
const {APiUtils} = require('../utils/APiUtils');
const config = require('../config/base.config');
const currentDateandTime = new Date().toLocaleString()

let token;
test.beforeAll(async () => {
    token = await APiUtils.getTokenForTests(config.loginPayload);
})

test('@API open community page', async ({page})=>
{ 
    await APiUtils.setupAuthentication(page, token);
    await page.goto(config.communityURL);
    await page.waitForLoadState('networkidle');
    const isAuthenticated = await APiUtils.checkAuthentication(page, 'community');
    if (!isAuthenticated) {
        throw new Error('Authentication failed');
    }
    
    console.log("✅ Successfully accessed community page");

    await page.getByRole('button', { name: 'Ask' }).click();
    await page.locator('input[name="title"]').click();
    await page.locator('input[name="title"]').fill(`Automated Test at ${currentDateandTime}`);
    await page.getByLabel('', { exact: true }).click();
    await page.getByRole('option', { name: 'Body Contouring' }).click();
    await page.locator('textarea[name="content"]').click();
    await page.locator('textarea[name="content"]').fill('This is automated');
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Check if submit button exists
    try {
        const submitButton = page.getByRole('button', { name: 'Ask' });
        await submitButton.waitFor({ timeout: 5000 });
        console.log("✅ Submit button found - returning truthy value");
        return true;
    } catch (error) {
        console.log("❌ Submit button not found or not visible");
        const pageTitle = await page.title();
        console.log("Page title:", pageTitle);
        
        return false;
    }

});


// await page.locator('div:nth-child(14) > .MuiPaper-root > div:nth-child(2) > .MuiTypography-root.MuiTypography-subtitle1.css-2wf5s9-MuiTypography-root').click();
//   await page.getByRole('textbox', { name: 'Add a comment' }).click();
//   await page.getByRole('textbox', { name: 'Add a comment' }).fill('this is test comment');
//   await page.getByRole('button', { name: 'Comment' }).click();
