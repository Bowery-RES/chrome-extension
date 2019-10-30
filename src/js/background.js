import '../img/bowery_icon.png';
import 'chrome-extension-async';
import get from 'lodash/get';
import { BOWERY_APP_DOMAIN } from 'secrets';
const STREET_EASY_FILTER = {
    url: [{ urlMatches: 'https://streeteasy.com/building/' }, { urlMatches: 'https://streeteasy.com/rental/' }],
};

async function getBoweryToken() {
    const { token } = await chrome.storage.local.get('token');
    if (token) {
        return token;
    }
    try {
      const window = await chrome.windows.create({
          url: BOWERY_APP_DOMAIN,
          type: 'popup',
          focused: false,
      });
      const tabId = get(window, 'tabs[0].id');
      const [jwToken] = await chrome.tabs.executeScript(tabId, { code: "localStorage.getItem('jwToken')" });
      await chrome.windows.remove(window.id);
      await chrome.storage.local.set({ token: jwToken });
      return jwToken;
    } catch (error) {
      console.log(error)
    }
}

chrome.extension.onRequest.addListener(({ type, data }) => {
    if (type === 'popup-opened') {
      chrome.tabs.executeScript({ file: 'parse-comp.bundle.js' });
    }
});

chrome.webNavigation.onCompleted.addListener(getBoweryToken, STREET_EASY_FILTER);
