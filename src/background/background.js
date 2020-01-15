import '../assets/bowery_icon.png';
import '../assets/bowery_icon_disabled.png';
import 'chrome-extension-async';
import AuthService from '../app/services/AuthService';
import TrackingService from '../app/services/TrackingService';
import { EVENTS } from '../app/lib/constants';
import {BOWERY_APP_DOMAIN} from 'secrets'

import uniqBy from 'lodash/uniqBy';

const normalizeReportUrl = (url = '') => {
  const [reportUrl] = url.match(/((\d|\w){24})/);
  return `${BOWERY_APP_DOMAIN}/report/${reportUrl}`;
};

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

chrome.runtime.onMessage.addListener(({ type, data }, sender, sendResponse) => {
  switch (type) {
    case EVENTS.EXTENSION_OPEN:
      chrome.tabs.executeScript({ file: 'widget.js' });
      break;
    case EVENTS.INITIALIZE:
      AuthService.authenticate().then(({user})=> {
        TrackingService.identify(user);
        TrackingService.logEvent('Chrome Extension Clicked');
        chrome.tabs.executeScript({ file: 'parseStreetEasy.js' });
      });
      break;
    case EVENTS.COMP_ADDED:
      TrackingService.logEvent('Chrome Extension Comp Added');
      break;
    case EVENTS.COMP_PARSED:
      chrome.tabs.query({ active: true, currentWindow: true }).then(([activeTab])=>{
        chrome.tabs.sendMessage(activeTab.id, { type: EVENTS.COMP_PARSED, data });
      });
      break;
    case "GET_LAST_REPORTS": 
      chrome.history.search({
        text: `${BOWERY_APP_DOMAIN}/report/`,
        startTime: Date.now() - 1008000000,
      }).then((history)=> {
        const reportsVisited = history.filter(
          page =>
            page.url.match(/(\/report\/(\d|\w){24})/) &&
            page.title !== 'Bowery' &&
            !BOWERY_APP_DOMAIN.includes(page.title),
        );
      
        const reports = reportsVisited.map(page => ({
          value: normalizeReportUrl(page.url),
          label: page.title,
        }));
        sendResponse(uniqBy(reports, 'value').slice(0, 5));
      });
      
      break;
    default:
      break;
  }
  return true; 
});
