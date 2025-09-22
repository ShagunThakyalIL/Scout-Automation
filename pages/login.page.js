exports.LoginPage = class LoginPage {
    constructor(page) {
        this.page = page;
    }

    async login(username, password) {
        await this.page.getByRole('textbox', { name: 'username' }).fill(username);
        await this.page.getByRole('textbox', { name: 'password' }).fill(password);

        await this.page.getByRole('button', { name: 'Login' }).click();

        try {
            console.log('After login URL:', this.page.url());
            await this.page.screenshot({ path: 'login-result.png', fullPage: true });
            await this.page.waitForSelector('text=Logout', { timeout: 5000 });

            return true;
        } catch (err) {
            console.error('Login failed or Dashboard not found:', err.message);
            return false;
        }
    }
};
