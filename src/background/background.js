import '../assets/bowery_icon.png';
import '../assets/bowery_icon_disabled.png';
import 'chrome-extension-async';
import AuthService from '../app/services/AuthService';
import TrackingService from '../app/services/TrackingService';
import { EVENTS } from '../app/lib/constants';

async function activationHandler({ tabId }) {
    const tab = await chrome.tabs.get(tabId);
    if (!tab.active) {
        return;
    }

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

chrome.runtime.onMessage.addListener(async ({ type, data }, sender, sendResponse) => {
    switch (type) {
        case EVENTS.EXTENSION_OPEN:
            chrome.tabs.executeScript({ file: 'widget.js' });
            break;
        case EVENTS.INITIALIZE:
            const authInfo = await AuthService.authenticate();
            const user = authInfo.user;
            TrackingService.identify(user);
            TrackingService.logEvent('Chrome Extension Clicked');
            chrome.tabs.executeScript({ file: 'parseStreetEasy.js' });
            break;
        case EVENTS.COMP_ADDED:
            TrackingService.logEvent('Chrome Extension Comp Added');
            break;
        case EVENTS.COMP_PARSED:
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            chrome.tabs.sendMessage(activeTab.id, { type: EVENTS.COMP_PARSED, data });
            break;
        default:
            break;
    }
    sendResponse();
});
