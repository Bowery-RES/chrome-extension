import '../img/icon-128.png'
import '../img/icon-34.png'
import 'chrome-extension-async'
import get from 'lodash/get'
const BOWERY_APP_URL = "https://bowery-staging.herokuapp.com"

async function getBoweryToken({ url }) {
  const { token } = await chrome.storage.sync.get('token')
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
  await chrome.storage.sync.set({ token: jwToken })
  return jwToken
}

async function onRequest({type, data}){
  
  await chrome.storage.sync.set({ unitComp: data })
  console.log(type, data);
}

chrome.extension.onRequest.addListener(onRequest);
chrome.tabs.onActivated.addListener(async function ({ tabId, ...other }) {
  console.log(other)
  // const token = await getBoweryToken({ url: BOWERY_APP_URL })

  // await chrome.tabs.executeScript(tabId, {
  //   file: "parse-comp.bundle.js"
  // });
})

chrome.webNavigation.onCompleted.addListener(async function ({ tabId, ...other }) {
  // const token = await getBoweryToken({ url: BOWERY_APP_URL })

  await chrome.tabs.executeScript(tabId, {
    file: "parse-comp.bundle.js"
  });
}, { url: [{ urlMatches: 'https://streeteasy.com/building/' }] });
