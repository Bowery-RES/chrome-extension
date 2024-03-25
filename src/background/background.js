import '../assets/logo_production.png'
import '../assets/logo_disabled.png'
import '../assets/logo_development.png'
import '../assets/font.css'

import 'chrome-extension-async'
import AuthService from '../services/AuthService'
import BoweryService from '../services/BoweryService'
import TrackingService from '../services/TrackingService'
import { EVENTS, SOURCES_MAP } from '../constants'
import ChromeService from '../services/ChromeService'
import ErrorService from '../services/ErrorService'

const chrome = new ChromeService()

chrome.on(EVENTS.EXTENSION_OPEN, (data, sendResponse) => {
  ChromeService.executeScript({ file: 'widget.js', runAt: 'document_start' })
  sendResponse()
})

chrome.on(EVENTS.INITIALIZE, (data, sendResponse) => {
  AuthService.authenticate()
    .then(({ user }) => {
      TrackingService.identify(user)
      TrackingService.logEvent('Chrome Extension Clicked', { source: SOURCES_MAP[data.hostname] })
      ChromeService.executeScript({ file: 'parse.js' })
      chrome.waitFor(EVENTS.COMP_PARSED).then(sendResponse)
      chrome.waitFor(EVENTS.COMP_PARSE_FAILED).then(sendResponse)
    })
    .catch((error) => {
      const err = new Error(ErrorService.messages().AUTH, { cause: error })
      sendResponse(ErrorService.serialize(err))
    })
})

chrome.on(EVENTS.LAST_REPORT_INITIALIZE, (data, sendResponse) => {
  BoweryService.getLastVisitedReports().then(sendResponse)
})

chrome.on(EVENTS.COMP_ADDED, (data, sendResponse) => {
  TrackingService.logEvent('Chrome Extension Comp Added', { source: data.sourceName })
  sendResponse()
})
