import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page.js';
import config from '../../config/base.config.js';
import {DeploymentPage} from '../../pages/deployment.page.js';

test.describe('Deployment Tests', () => {
   let deploymentPage;
   test.beforeEach(async ({page}) => {
       const loginPage = new LoginPage(page);
       await page.goto(config.baseURL);
       await loginPage.login(config.credentials.username, config.credentials.password);

       deploymentPage = new DeploymentPage(page);
       await deploymentPage.openDeployment('1502');
   })

   test('View Deployment', async({page}) => {
    await deploymentPage.pagination();
  })

  test('Add Deployment', async({page}) => {
    await deploymentPage.addDeployment();
  })

  test('Edit Deployment', async({page}) => {
    await deploymentPage.editDeployment();
  })

  test('Get First Deployment', async({page}) => {
    const firstDeployent = await deploymentPage.getFirstDeploymentNumber();
    console.log(firstDeployent);
  })

  test('Delete Deployment', async({page}) => {
    await deploymentPage.deleteDeployment();
  })
});
