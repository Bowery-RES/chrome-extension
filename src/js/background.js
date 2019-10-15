import '../img/icon-128.png'
import '../img/icon-34.png'
import 'chrome-extension-async'
import get from 'lodash/get'
const BOWERY_APP_URL = "https://bowery-staging.herokuapp.com"

async function getBoweryToken({ url }) {
    const window = await chrome.windows.create({
        url,
        type: "popup",
        focused: false,
    })

    const tabId = get(window, 'tabs[0].id');
    const [token] = await chrome.tabs.executeScript(tabId,
        { code: "localStorage.getItem('jwToken')" });
    await chrome.windows.remove(window.id);
    return token
}

chrome.webNavigation.onCompleted.addListener(async function ({ tabId }) {
    const { token } = await chrome.storage.sync.get('token')
    if (!token) {
        chrome.storage.sync.set({ token: await getBoweryToken({ url: BOWERY_APP_URL }) })
    }
   



    chrome.extension.onRequest.addListener(function (parsedData) {
        debugger;

        console.log(parsedData);
    });

    chrome.tabs.executeScript(tabId, {
        file: "parse-comp.bundle.js"
    });

}, { url: [{ urlMatches: 'https://streeteasy.com/building/' }] });
