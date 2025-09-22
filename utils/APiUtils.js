class APiUtils
{

    constructor(apiContext,loginPayLoad)
    {
        this.apiContext =apiContext; 
        this.loginPayLoad = loginPayLoad;
        
    }

    async getToken()
     {
        try {
            const loginResponse = await this.apiContext.post("http://13.53.107.177:8001/auth/login",
            {
                data: this.loginPayLoad,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // Check if response is successful
            if (!loginResponse.ok) {
                const responseText = await loginResponse.text();
                console.error(`Login failed with status: ${loginResponse.status}`);
                console.error('Response body:', responseText);
                throw new Error(`Login failed with status: ${loginResponse.status}`);
            }
            
            const loginResponseJson = await loginResponse.json();
            
            // Validate that accessToken exists
            if (!loginResponseJson.accessToken) {
                console.error('Response JSON:', loginResponseJson);
                throw new Error('Access token not found in response');
            }

            console.log('Login response:', loginResponseJson.accessToken);
            
            const token = loginResponseJson.accessToken;
            return token;
            
        } catch (error) {
            console.error('Error getting token:', error.message);
            throw error;
        }
    }

    // Utility function to set up authentication for any page
    static async setupAuthentication(page, token, apiBaseUrl = 'http://13.53.107.177:8001') {
        await page.addInitScript((tokenValue, apiUrl) => {
            // Store token in multiple ways for cross-origin compatibility
            localStorage.setItem('authToken', tokenValue);
            
            // Set API base URL for the frontend to know where to make API calls
            localStorage.setItem('apiUrl', apiUrl);
            
            // Set global variables
            window.authToken = tokenValue;
            window.apiBaseUrl = apiUrl;
            
            console.log('Authentication setup complete:', {
                token: localStorage.getItem('authToken'),
                apiUrl: localStorage.getItem('apiBaseUrl')
            });
        }, token, apiBaseUrl);
    }

    // Utility function to check if authentication is working
    static async checkAuthentication(page, expectedUrl = null) {
        const currentUrl = page.url();
        // Check if redirected to login (authentication failed)
        if (currentUrl.includes('login')) {
            console.log("❌ Authentication failed - redirected to login");
            return false;
        }
        
        // Check if we're on the expected URL
        if (expectedUrl && !currentUrl.includes(expectedUrl)) {
            console.log(`❌ Not on expected URL. Expected: ${expectedUrl}, Current: ${currentUrl}`);
            return false;
        }
        
        console.log("✅ Authentication successful");
        return true;
    }

    // Utility function to get token for tests (use in beforeAll)
    static async getTokenForTests(loginPayLoad, apiUrl = 'http://13.53.107.177:8001/auth/login') {
        const { request } = require('@playwright/test');
        const apiContext = await request.newContext();
        const apiUtils = new APiUtils(apiContext, loginPayLoad);
        const token = await apiUtils.getToken();
        return token;
    }

    }
module.exports = {APiUtils};




