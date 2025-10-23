import config from '../config/base.config.js';
import { LoginPage } from '../pages/login.page.js';
import { expect } from '@playwright/test';


exports.WorkOrderPage = class WorkOrderPage {
  constructor(page) {
    this.page = page;
  }

// Login
  async login(page){
      const loginPage = new LoginPage(page);
      await this.page.goto(config.baseURL);
      const result = await loginPage.login(config.credentials.username, config.credentials.password);
  }

// Home
  async openWorkOrder(assetType) {
    await this.page.getByText(assetType).first().click();
    await this.page.getByText('Work Orders').click();
  }

// View all WorkOrders

  async getFirstWorkOrderNumber() {
    await this.page.waitForSelector('table tbody tr:first-child td');

    await this.page.waitForFunction(() => {
      const cell = document.querySelector('table tbody tr:first-child td');
      return cell && cell.innerText.trim() !== '' && !/loading/i.test(cell.innerText);
    });

    return await this.page.locator('table tbody tr:first-child td').first().innerText();
  }
  
  async addWorkOrder(){
    await this.page.getByRole('button', {name : 'Add New Work Order'}).click();
  }

  async filterWorkOrders() {
    await this.page.getByRole('button', { name: 'CLOSED' }).click();
    await this.page.getByRole('button', { name: 'OPEN' }).click();
    await this.page.getByRole('button', { name: 'ALL' }).click();
  }

  async deleteJob(jobId) {
    await this.page.locator('.lucide.lucide-trash').first().click();
    await this.page.locator('.lucide.lucide-x').first().click();
  }

  async deleteFirstNJobs(n) {
  const workOrderNumbers = await this.getAllWorkOrderNumbers();

  // limit to n items
  const jobsToDelete = workOrderNumbers.slice(0, n);

  for (const jobId of jobsToDelete) {
    // find the row containing this jobId and click its trash icon
    const row = this.page.locator(`table tbody tr:has(td:text-is("${jobId}"))`);
    await row.locator('.lucide.lucide-trash').click();

    // confirm delete by clicking the blue "Delete" button
    await this.page.getByRole('button', { name: 'Delete' }).click();

    // wait for deletion to complete (table refresh)
    await this.page.waitForTimeout(1500);
  }
  }

  async editJob() {
    await this.page.locator('.lucide.lucide-pencil').first().click();
  }

  async viewJobNotes(jobId) {
    await this.page.getByRole('row', { name: jobId }).getByRole('img').first().click();
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }

  async viewJob(jobId) {
    await this.page.getByRole('row', { name: jobId }).getByRole('img').nth(1).click();
  }
  
// Find Word Order

  async searchWorkOrder(jobId) {
    await this.page.getByRole('button', { name: 'Find Work Order' }).click();
    await this.page.getByRole('textbox', { name: 'Job ID: Container ID:' }).click();
    await this.page.getByRole('textbox', { name: 'Job ID: Container ID:' }).fill(jobId);
    await this.page.getByRole('button', { name: 'Find Work Order' }).click();
  }

  async deleteJobFind(jobId) {
    await this.page.getByRole('row', { name: jobId }).getByRole('img').nth(1).click();
    await this.page.getByRole('button', { name: 'DELETE JOB' }).click();
    await this.page.getByRole('button').filter({ hasText: /^$/ }).first().click();
  }

   async viewJobNotesFind(jobId) {
    await this.page.getByRole('row', { name: jobId }).getByRole('img').nth(1).click();
    await this.page.getByRole('button', { name: 'JOB NOTES' }).click();
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }

// View Work Order

  async editJobButton() {
    await this.page.getByRole('button', { name: 'Edit JOB' }).click();
  }

  async deleteJobButton() {
    await this.page.getByRole('button', { name: 'DELETE JOB' }).click();
    await this.page.getByRole('button').filter({ hasText: /^$/ }).first().click();
  }

   async viewJobNotesButton() {
    await this.page.getByRole('button', { name: 'JOB NOTES' }).click();
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }

  async viewPartsUsed() {
    await this.page.getByRole('button', { name: 'View Parts Used' }).click();

  }

  async addAsset() {
    await this.page.getByRole('button', { name: 'Add Asset' }).click();
  }

  async addAssetJob(asset){
    await this.page.getByRole('button', { name: 'Add Asset' }).click();
    await this.page.getByPlaceholder('Search Serial Number').fill(asset);
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.locator('svg.cursor-pointer.w-4.h-4').nth(1).click();
    await this.page.getByRole('button', { name: 'Submit' }).click();

   const toastMessage = this.page.locator('div.Toastify__toast:has-text("Procedure not found for the given combination")');
    try {
        await toastMessage.waitFor({ state: 'visible', timeout: 5000 });
        console.log(`Error for asset ${asset}: Procedure not found`);

        const closeBtn = toastMessage.locator('button.Toastify__close-button');
        if (await closeBtn.isVisible()) {
            await closeBtn.click();
        }
        
        await this.page.goBack();
      } catch (e) {
        // Timeout means toast did not appear, continue normally
      }

    this.page.goBack();
  }
  async addAssetToJob(Assets) {
    // Get all work order numbers
    const workOrders = await this.getAllWorkOrderNumbers();
    const trimmedWorkOrders = workOrders.slice(0, Assets.length);

    // Loop through each asset and corresponding work order
    for (let i = 0; i < Assets.length; i++) {
        const jobId = trimmedWorkOrders[i];
        const asset = Assets[i];

        // Open the job
        // Locate the <select> element and choose the option with value "20"
       await this.page.locator('select').selectOption('20');
       await this.page.waitForTimeout(1500);

        await this.viewJob(jobId);
        await this.page.waitForTimeout(2000);

        // Add the asset
        await this.addAssetJob(asset);
    }
  }

  // Production
  async goto() {
    await this.page.goBack();
  }
  
  async getAllWorkOrderNumbers() {
    // Wait until at least one valid row (not "No data available" or "Loading...") is present

    await this.page.locator('select').selectOption('20');
       await this.page.waitForTimeout(1500);
    await this.page.waitForFunction(() => {
      const firstCell = document.querySelector('table tbody tr:first-child td');
      if (!firstCell) return false;
      const text = firstCell.innerText.trim();
      return text !== '' && !/loading/i.test(text) && !/no data available/i.test(text);
    });

    // Collect all first-column values
    const rows = this.page.locator('table tbody tr td:first-child');
    const workOrderNumbers = await rows.allInnerTexts();

    // Clean up: remove empty rows and placeholders
    return workOrderNumbers
      .map(num => num.trim())
      .filter(num => num.length > 0 && !/no data available/i.test(num));
  }

  async viewJobAsset(jobId){
    await this.page.getByRole('row', { name: jobId }).getByRole('img').nth(1).click();

    // Wait for product line element if it exists
    const productLineValue = this.page.locator('text=Product Line: >> xpath=following-sibling::h1');
    if (await productLineValue.count() > 0) {
      await expect(productLineValue).toHaveText(/.+/, { timeout: 10000 });
    } else {
      throw new Error('Product Line element not found on the page');
    }


    const btn = await this.page.locator('button.text-gray-600').nth(2);
    if(await btn.isVisible()){
      await btn.click();
      await this.page.goBack();
    } 

    await this.page.goBack();
  }

  async performMassProduction() {
    // Get all work order numbers
    const workOrders = await this.getAllWorkOrderNumbers();
    const trimmedWorkOrders = workOrders.slice(0, 20);

    for (let i = 0; i < 20; i++) {
        const jobId = trimmedWorkOrders[i];

        // Select the <select> value
        await this.page.locator('select').selectOption('20');
        await this.page.waitForTimeout(1500);

        // Open the job
        await this.viewJob(jobId);
        await this.page.waitForTimeout(2000);

        // Go to production test
        await this.page.locator('svg:has(path[d^="M402.6 83.2"])').click();


        await this.page.waitForTimeout(1000);

        // Click "Final"
        await this.page.click('button:has-text("Final")');

        // Open dropdown
        await this.page.click('button[role="combobox"]');

        // Click the "Ready" option properly
        const readyOption = this.page.locator('div[role="option"]', { hasText: 'Ready' });
        await readyOption.waitFor({ state: 'visible', timeout: 5000 });
        await readyOption.click(); // this should close the dropdown

        // Fill comments
        await this.page.fill('textarea[placeholder="Add Comments"]', 'Testing comments');

        // Click "Submit Result"
        const submitBtn = this.page.locator('button:has-text("Submit Result")');
        await submitBtn.waitFor({ state: 'visible', timeout: 5000 });
        await submitBtn.scrollIntoViewIfNeeded();
        await submitBtn.click({ force: true }); // force if dropdown or overlay blocks

        await this.page.waitForTimeout(1000);

        // Go back to previous pages
        await this.page.goBack();
        await this.page.goBack();
    }
}



  // Add Work Order
  async addWorkOrderDetails(page){
    // Arrays for dynamic dropdowns
    const ownershipOptions = ['Scout Owned', 'Customer Owned'];
    const certificationOptions = ['4 month certification', '6 month certification', '12 month certification',
                                  '3 month inspection','6 month inspection', 'New Commission 6 Month',
                                  'New Commission 12 Month','General Maintenance', 'NISD 6mo', 'NISD 12mo'];

    // Hardcoded dropdowns
    const certLevel = 'level 1';
    const unitType = 'Loose Iron';
    const custmer = ["Alamo 86","Asap","B&B Oilfield Equipment Corp.",
                        "Calfrac Green","Flowvalve","Cudd Orange",
                        "HPI","Nextier 5","NESR","Purefrac Rebel"]; // for customer owned work order.


    // Function to select an option from Radix dropdown
    async function selectRadixDropdown(page, comboIndex, optionName) {
      await page.locator('button[role="combobox"]').nth(comboIndex).click();
      await page.getByRole('option', { name: optionName }).filter({ hasText: optionName }).click();
    }

    // Function to create a single work order
    async function createWorkOrder(page, ownership, customerUseOption, certification) {
      await selectRadixDropdown(page, 0, ownership);

      if (ownership === 'Customer Owned') {
        await selectRadixDropdown(page, 1, customerUseOption); 
      }

      await selectRadixDropdown(page, 2, certification);
      await selectRadixDropdown(page, 3, certLevel);
      await selectRadixDropdown(page, 4, unitType);
      await page.getByRole('button', { name: 'Add Work Order' }).click();
    }

    // Loop through all combinations dynamically
    await page.getByRole('button', { name: 'Add New Work Order' }).click(); 
    //Scout Owned
    for (const certification of certificationOptions) {
        await createWorkOrder(page, "Scout Owned", "Scout Owned", certification);
       await page.waitForTimeout(3000); 
        await page.goBack();
    }

    //Customer Owned
    for (let i = 0; i<certificationOptions.length; i++) {
      const certification = certificationOptions[i];
      const customerUseOption = custmer[i];
      await createWorkOrder(page, "Customer Owned", customerUseOption, certification);
      await page.waitForTimeout(3000); 
      await page.goBack();
    }

  }
};
