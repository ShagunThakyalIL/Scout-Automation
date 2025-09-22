import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page.js';
import config from '../../config/base.config.js';
import { WorkOrderPage, addWorkOrder } from '../../pages/workOrder.page.js';

test.describe('Work Order Tests', () => {
  let workOrderPage; // assigned value inside beforeEach to use it in other functoins.
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(config.baseURL);
    const result = await loginPage.login(config.credentials.username, config.credentials.password);
    workOrderPage = new WorkOrderPage(page);
    await workOrderPage.openJob('1502');
  });

  test('Filter Work Orders', async ({ page }) => {
    await workOrderPage.filterWorkOrders();
    // ✅ Add expect based on filter result
  });

  test('Add new work order page', async ({page}) => {
    await workOrderPage.addWorkOrder();
  })


});
