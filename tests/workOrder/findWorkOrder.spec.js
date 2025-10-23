import { test, expect } from '@playwright/test';
import { WorkOrderPage } from '../../pages/workOrder.page.js';

test.describe('Find Work Order Tests', () => {
  let workOrderPage;
  let firstWorkOrder;
  
  test.beforeEach(async ({ page }) => {
    await workOrderPage.login();

    workOrderPage = new WorkOrderPage(page);
    await workOrderPage.openWorkOrder('1502');

    if (test.info().title === 'Search Work Order by invalid ID') return;

    firstWorkOrder = await workOrderPage.getFirstWorkOrderNumber();
    await workOrderPage.searchWorkOrder(firstWorkOrder);
  });

  test('Search Work Order by valid ID', async ({ page }) => {
    await expect(page.getByRole('row', { name: new RegExp(firstWorkOrder) })).toBeVisible();
  });

  test('Search Work Order by invalid ID', async ({ page }) => {
    const wrongWorkOrder = 'INVALID123456';
    await workOrderPage.searchWorkOrder(wrongWorkOrder);

    await expect(page.getByText(/No job found with id/i)).toBeVisible();
  });

  test('Delete Work Order', async ({ page }) => {
    await workOrderPage.deleteJob(firstWorkOrder);
  });

  test('Delete Work Order from View Work order', async ({ page }) => {
    await workOrderPage.deleteJobFind(firstWorkOrder);
  });

  test('View Job Notes', async ({ page }) => {
    await workOrderPage.viewJobNotes(firstWorkOrder);
  });

  test('View Job Notes from View work order', async ({ page }) => {
    await workOrderPage.viewJobNotesFind(firstWorkOrder);
  });

  test('Open Edit page', async ({page}) => {
    await workOrderPage.editJob();
  })
});
