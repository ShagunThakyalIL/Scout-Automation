import { test, expect } from '@playwright/test';
import { WorkOrderPage, addWorkOrder } from '../../pages/workOrder.page.js';

test.describe('Work Order Tests', () => {
  let workOrderPage;
  let firstWorkOrder;
    
  test.beforeEach(async ({ page }) => {
    workOrderPage = new WorkOrderPage(page);workOrderPage = new WorkOrderPage(page);
    await workOrderPage.login(page);
    await workOrderPage.openWorkOrder('1502');

    if (test.info().title === 'Search Work Order by invalid ID') return;
  });

  test('Find All Work Orders', async ({ page }) => {
    const workOrders = await workOrderPage.getAllWorkOrderNumbers();
    for(let i = 0; i<workOrders.length; i++)
    {
        await workOrderPage.viewJobAsset(workOrders[i]);
        await page.goBack();
    }
  });

  test('Perform mass production', async ({page}) => {
      await workOrderPage.performMassProduction();
  })

});
