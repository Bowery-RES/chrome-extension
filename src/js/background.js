import '../img/icon-128.png'
import '../img/icon-34.png'
import 'chrome-extension-async'
import get from 'lodash/get'
const BOWERY_APP_URL = "https://bowery-staging.herokuapp.com"
const STREET_EASY_FILTER = { url: [{ urlMatches: 'https://streeteasy.com/building/'}, { urlMatches: 'https://streeteasy.com/rental/'}] }

async function getBoweryToken({ url }) {
  const { token } = await chrome.storage.local.get('token')
  if (token) {
    return token
  }

  const window = await chrome.windows.create({
    url,
    type: "popup",
    focused: false,
  })

  const tabId = get(window, 'tabs[0].id');
  const [jwToken] = await chrome.tabs.executeScript(tabId, { code: "localStorage.getItem('jwToken')" });
  await chrome.windows.remove(window.id);
  await chrome.storage.local.set({ token: jwToken })
  return jwToken
}

chrome.extension.onRequest.addListener(({type, data})=>{
  if(type === 'comp-parsed'){
    chrome.storage.local.set({ unitComp: data })
  }
});

chrome.webNavigation.onCompleted.addListener(({ tabId })=> {
  chrome.tabs.executeScript(tabId, {file: "parse-comp.bundle.js"});
  chrome.tabs.onActivated.addListener((params)=>{
    if(tabId !== params.tabId){
      return 
    }
    chrome.tabs.executeScript(tabId, {file: "parse-comp.bundle.js"});
  })
}, STREET_EASY_FILTER);