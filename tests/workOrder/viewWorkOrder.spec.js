import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page.js';
import config from '../../config/base.config.js';
import { WorkOrderPage, addWorkOrder } from '../../pages/workOrder.page.js';

test.describe('Work Order Tests', () => {
  let workOrderPage;
  let firstWorkOrder;
    
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(config.baseURL);
    const result = await loginPage.login(config.credentials.username, config.credentials.password);

    workOrderPage = new WorkOrderPage(page);
    await workOrderPage.openWorkOrder('1502');

    if (test.info().title === 'Search Work Order by invalid ID') return;

    firstWorkOrder = await workOrderPage.getFirstWorkOrderNumber();
    await workOrderPage.viewJob(firstWorkOrder);
  });

  test('Edit job', async({page}) => {
    await workOrderPage.editJobButton(firstWorkOrder);
  })

  test('Delete Job', async({page}) => {
    await workOrderPage.deleteJobButton();
  })

  test('Job Notes', async({page}) => {
    await workOrderPage.viewJobNotesButton();
  })
  
  test('View parts Used', async({page}) => {
    await workOrderPage.viewPartsUsed();
  })

  test('Add Asset', async({page}) => {
    await workOrderPage.addAsset();
  })
});
