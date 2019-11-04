import '../img/bowery_icon.png';
import 'chrome-extension-async';
import get from 'lodash/get';
import { validateToken } from '@utils';
import { BOWERY_APP_DOMAIN } from 'secrets';

async function getBoweryToken() {
    const { token } = await chrome.storage.local.get('token');

    const valid = await validateToken(token)
    if (valid) {
        return;
    }

    const window = await chrome.windows.create({
        url: BOWERY_APP_DOMAIN,
        type: 'popup',
        focused: false,
    });
    const tabId = get(window, 'tabs[0].id');
    const [jwToken] = await chrome.tabs.executeScript(tabId, { code: "localStorage.getItem('jwToken')" });
    await chrome.windows.remove(window.id);
    await chrome.storage.local.set({ token: jwToken });
    if (!jwToken) {
        throw new Error('You have to be logged in to the Bowery application.');
    }
}

chrome.extension.onRequest.addListener(async ({ type, data }) => {
    if (type === 'popup-opened') {
        try {
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!activeTab.url.match(/https:\/\/streeteasy.com\/building\/|https:\/\/streeteasy.com\/rental\//)) {
                throw new Error('The extension pulls data only from Streeteasy.');
            }
            await getBoweryToken();
            await chrome.tabs.executeScript({ file: 'parse-comp.bundle.js' });
        } catch (error) {
            chrome.extension.sendRequest({ error: error.message });
        }
    }
});
