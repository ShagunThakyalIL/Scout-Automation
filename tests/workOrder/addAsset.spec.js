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

    test(`Add Assets to Job - ${type}`, async ({ page }) => {
      const assets = [];
      // Fill the array from 20 down to 1
      for (let i = 20; i >= 1; i--) {
        assets.push(`test_${type.replace(/\s+/g, '_')}_ada_${i.toString().padStart(3, '0')}`); //1502
        assets.push(`test_bb_3w_${i.toString().padStart(3, '0')}`); // Big Bore
        assets.push(`test_hose_hh_${i.toString().padStart(3, '0')}`); // hoses
        assets.push(`test_SE_dcu_${i.toString().padStart(3, '0')}`); // Surface Equipment
      }
      await workOrderPage.addAssetToJob(assets);
    });
  });
});
