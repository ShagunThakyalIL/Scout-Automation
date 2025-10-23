import { test, expect } from '@playwright/test';
import { WorkOrderPage } from '../../pages/workOrder.page.js';

// List of work order types
const workOrderTypes = ['1502', 'big bore', 'hoses', 'surface equipment'];

workOrderTypes.forEach((type) => {
  // if (type !== '1502') return; 
  // if (type !== 'big bore') return; 
  // if (type !== 'hoses') return; 
  // if (type !== 'surface equipment') return; 
  test.describe.parallel(`Add Work Order Tests for ${type}`, () => {
    let workOrderPage;

    test.beforeEach(async ({ page }) => {
      workOrderPage = new WorkOrderPage(page);
      await workOrderPage.login(page);

      await workOrderPage.openWorkOrder(type);

      if (test.info().title === 'Search Work Order by invalid ID') return;
    });
    test('Delete N work Orders', async ({ page }) => {
      await workOrderPage.deleteFirstNJobs(20); 
    });
    
  });
});
