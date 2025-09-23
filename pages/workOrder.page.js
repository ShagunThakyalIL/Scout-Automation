exports.WorkOrderPage = class WorkOrderPage {
  constructor(page) {
    this.page = page;
  }

  async openWorkOrder(jobId) {
    await this.page.getByText(jobId).first().click();
    await this.page.getByText('Work Orders').click();
  }

  async getFirstWorkOrderNumber() {
    await this.page.waitForSelector('table tbody tr:first-child td');

    await this.page.waitForFunction(() => {
      const cell = document.querySelector('table tbody tr:first-child td');
      return cell && cell.innerText.trim() !== '' && !/loading/i.test(cell.innerText);
    });

    return await this.page.locator('table tbody tr:first-child td').first().innerText();
  }


  async filterWorkOrders() {
    await this.page.getByRole('button', { name: 'CLOSED' }).click();
    await this.page.getByRole('button', { name: 'OPEN' }).click();
    await this.page.getByRole('button', { name: 'ALL' }).click();
  }

  async addWorkOrder(){
    await this.page.getByRole('button', {name : 'Add New Work Order'}).click();
  }

  async searchWorkOrder(jobId) {
    await this.page.getByRole('button', { name: 'Find Work Order' }).click();
    await this.page.getByRole('textbox', { name: 'Job ID: Container ID:' }).click();
    await this.page.getByRole('textbox', { name: 'Job ID: Container ID:' }).fill(jobId);
    await this.page.getByRole('button', { name: 'Find Work Order' }).click();
  }

  async openJobRow(jobId) {
    await this.page.getByRole('row', { name: jobId }).getByRole('img').first().click();
  }

  async closeJobModal() {
    await this.page.getByRole('button', { name: 'Close', exact: true }).last().click();
  }

// Edit Job

  async editJob() {
    await this.page.locator('.lucide.lucide-pencil').first().click();
  }

  async editJobButton() {
    await this.page.getByRole('button', { name: 'Edit JOB' }).click();
  }


// Delete Job

  async deleteJob(jobId) {
    await this.page.locator('.lucide.lucide-trash').first().click();
    await this.page.getByRole('button').filter({ hasText: /^$/ }).first().click();
  }

  async deleteJobFind(jobId) {
    await this.page.getByRole('row', { name: jobId }).getByRole('img').nth(1).click();
    await this.page.getByRole('button', { name: 'DELETE JOB' }).click();
    await this.page.getByRole('button').filter({ hasText: /^$/ }).first().click();
  }

  async deleteJobButton() {
    await this.page.getByRole('button', { name: 'DELETE JOB' }).click();
    await this.page.getByRole('button').filter({ hasText: /^$/ }).first().click();
  }

// View Notes

  async viewJobNotes(jobId) {
    await this.page.getByRole('row', { name: jobId }).getByRole('img').first().click();
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }

  async viewJobNotesFind(jobId) {
    await this.page.getByRole('row', { name: jobId }).getByRole('img').nth(1).click();
    await this.page.getByRole('button', { name: 'JOB NOTES' }).click();
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }

   async viewJobNotesButton() {
    await this.page.getByRole('button', { name: 'JOB NOTES' }).click();
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }

  async viewPartsUsed() {
    await this.page.getByRole('button', { name: 'View Parts Used' }).click();

  }

  async viewJob(jobId) {
    await this.page.getByRole('row', { name: jobId }).getByRole('img').nth(1).click();
  }

  async addAsset() {
    await this.page.getByRole('button', { name: 'Add Asset' }).click();
  }

  async goBack() {
    await this.page.goBack();
  }
};
