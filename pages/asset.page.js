import config from '../config/base.config.js';
import { LoginPage } from '../pages/login.page.js';
import { expect } from '@playwright/test';


exports.AssetPage = class AssetPage {
  constructor(page) {
    this.page = page;
  }

// Login
  async login(page){
      const loginPage = new LoginPage(page);
      await this.page.goto(config.baseURL);
      const result = await loginPage.login(config.credentials.username, config.credentials.password);
  }

// Find Asset
  async openFindAsset() {
    await this.page.getByText(assetType).first().click();
    await this.page.getByText('Find Asset').click();
  }

// Asset History
  async openAssetHistory() {
    await this.page.getByText(assetType).first().click();
    await this.page.getByText('Asset History').click();
  }

// Create Asset
  async openCreateAsset() {
    await this.page.getByText(assetType).first().click();
    await this.page.getByText('Create Asset').click();
  }
};
