import 'chrome-extension-async'
import EventEmitter from 'events'
import { ALLOWED_URLS, LOGO_MAP } from '../constants'
import ErrorService from './ErrorService'

class ChromeService extends EventEmitter {
  constructor() {
    super()
    chrome.tabs.onActivated.addListener(ChromeService.activationHandler)
    chrome.webNavigation.onBeforeNavigate.addListener(ChromeService.activationHandler)
    chrome.runtime.onMessage.addListener(({ type, data }, sender, callback) => {
      super.emit(type, data, callback)
      return true
    })
  }

  waitFor(type) {
    return new Promise((resolve) =>
      this.once(type, (params, callback) => {
        resolve(params)
        callback()
      })
    )
  }

  static async activationHandler({ tabId }) {
    const tab = await chrome.tabs.get(tabId)
    if (!tab.active) {
      return
    }

    const url = tab.url || tab.pendingUrl
    if (url.match(ALLOWED_URLS)) {
      await chrome.browserAction.setIcon({ path: LOGO_MAP[process.env.APP_ENV] || 'logo_development.png' })
      chrome.browserAction.enable()
    } else {
      await chrome.browserAction.setIcon({ path: 'logo_disabled.png' })
      chrome.browserAction.disable()
    }
  }

  static async emit({ type, data }) {
    const response = await chrome.runtime.sendMessage({ type, data })
    if (ErrorService.isSerializedError(response)) {
      throw ErrorService.deserialize(response)
    }
    return response
  }

  static executeScript(params) {
    return chrome.tabs.executeScript(params)
  }

  static async getDomainUrlsFromHistory(searchText) {
    const history = await chrome.history.search({
      text: searchText,
      startTime: Date.now() - 1008000000,
    })
    return history
  }

  static async getToken() {
    const { token } = await chrome.storage.local.get('token')
    return token
  }

  static setToken(token) {
    return chrome.storage.local.set({ token })
  }

  static async runScriptInNewTab({ script, url }) {
    const tab = await chrome.tabs.create({ url, active: false })
    const [result] = await chrome.tabs.executeScript(tab.id, { code: script })
    await chrome.tabs.remove(tab.id)
    return result
  }
}

export default ChromeService
