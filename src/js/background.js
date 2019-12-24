import '../img/bowery_icon.png';
import '../img/bowery_icon_disabled.png';
import 'chrome-extension-async';
import AuthService from '../services/AuthService'
import TrackingService from '../services/TrackingService'
import { EVENTS } from '../lib/constants'

async function activationHandler({ tabId }) {
  const tab = await chrome.tabs.get(tabId);
  const url = tab.url || tab.pendingUrl;
  if (url.match(/https:\/\/streeteasy.com\/building\/|https:\/\/streeteasy.com\/rental\//)) {
    await chrome.browserAction.setIcon({ path: 'bowery_icon.png' });
    chrome.browserAction.enable();
  } else {
    await chrome.browserAction.setIcon({ path: 'bowery_icon_disabled.png' });
    chrome.browserAction.disable();
  }
}

chrome.tabs.onActivated.addListener(activationHandler);
chrome.webNavigation.onBeforeNavigate.addListener(activationHandler);

chrome.runtime.onMessage.addListener(async ({ type }) => {
  try {
    switch (type) {
      case EVENTS.INITIALIZE:
        const authInfo = await AuthService.authenticate();
        const user = authInfo.user;
        TrackingService.identify(user)
        TrackingService.logEvent('Chrome Extension Clicked');
        chrome.tabs.executeScript({ file: 'parse-comp.bundle.js' });
        break;
      case EVENTS.COMP_ADDED:
        TrackingService.logEvent('Chrome Extension Comp Added');
        break;
      default:
        break;
    }
  } catch (error) {
    chrome.runtime.sendMessage({ error: error });
  }
});
