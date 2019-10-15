import get from 'lodash/get'

export const getBoweryAppToken = ({ url }) => new Promise(resolve =>{

    chrome.windows.create(
        {
            url: url,
            type: "popup",
            focused: false,
        },
        window => {
            const tabId = get(window, 'tabs[0].id');
            chrome.tabs.executeScript(
                tabId,
                { code: "localStorage.getItem('jwToken')" },
                ([token]) => {
                    chrome.windows.remove(window.id);

                    resolve(token);
                }
            );
        }
    );
});