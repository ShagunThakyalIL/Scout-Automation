import config from '../config/base.config.js';
import { LoginPage } from '../pages/login.page.js';
import { expect } from '@playwright/test';


exports.DeploymentPage = class DeploymentPage {
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
  async openDeployment(assetType) {
    await this.page.getByText(assetType).first().click();
    await this.page.getByText('Deployments').click();
  }

// View all WorkOrders

  async getFirstDeploymentNumber() {
    await this.page.waitForSelector('table tbody tr:first-child td');

    await this.page.waitForFunction(() => {
      const cell = document.querySelector('table tbody tr:first-child td');
      return cell && cell.innerText.trim() !== '' && !/loading/i.test(cell.innerText);
    });

    return await this.page.locator('table tbody tr:first-child td').first().innerText();
  }
  
  async addDeployment(){
    await this.page.getByRole('button', {name : 'Add Deployment'}).first().click();
  }

//  async filterWorkOrders() {
//     // Click the last occurrence of text
//     await page.getByText('last').click();

//     // Then click the first occurrence
//     await page.getByText('first').click();

//   }

  async pagination() {
    await this.page.getByText('last').first().click();
    await this.page.getByText('first').first().click();
  }

  async deleteDeployment() {
    await this.page.locator('svg[viewBox="0 0 448 512"].text-blue.cursor-pointer').first().click({ force: true });
    await this.page.getByText('Cancel', { exact: true }).click();
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

  async editDeployment() {
    await this.page.locator('td div.text-blue.cursor-pointer svg').nth(1).click({ force: true });
    await this.page.getByText('Edit Deployment', { exact: true }).waitFor();
  }

  async viewJobNotes(jobId) {
    await this.page.getByRole('row', { name: jobId }).getByRole('img').first().click();
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }

  async viewJob(jobId) {
    await this.page.getByRole('row', { name: jobId }).getByRole('img').nth(1).click();
  }
  
};
