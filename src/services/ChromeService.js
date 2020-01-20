
import 'chrome-extension-async';
import uniqBy from 'lodash/uniqBy';
import EventEmitter from 'events'

class ChromeService extends EventEmitter {
  constructor() {
    super()
    chrome.tabs.onActivated.addListener(ChromeService.activationHandler);
    chrome.webNavigation.onBeforeNavigate.addListener(ChromeService.activationHandler);
    chrome.runtime.onMessage.addListener(({ type, data }, sender, callback) => {
      super.emit(type, data, callback);
      return true;
    })
  }

  waitFor(type) {
    return new Promise((resolve, reject) =>
      this.once(type, resolve)
    )

  }

  static async activationHandler({ tabId }) {
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

  static emit({ type, data }) {
    return chrome.runtime.sendMessage({ type, data })
  }

  static executeScript(params) {
    return chrome.tabs.executeScript(params)
  }

  static async getDomainUrlsFromHistory(searchText) {
    const history = await chrome.history.search({
      text: searchText,
      startTime: Date.now() - 1008000000,
    });
    return uniqBy(history, 'title')
  }

  static async getToken() {
    const { token } = await chrome.storage.local.get('token');
    return token;
  }

  static setToken(token) {
    return chrome.storage.local.set({ token })
  }

  static async runScriptInNewTab({ script, url }) {
    const tab = await chrome.tabs.create({ url, active: false });
    const [result] = await chrome.tabs.executeScript(tab.id, { code: script });
    await chrome.tabs.remove(tab.id);
    return result
  }
}

export default ChromeService