import uniqBy from 'lodash/uniqBy';
import { BOWERY_APP_DOMAIN } from 'secrets';
import { fetchProperty } from './api';
import { EVENTS } from './constants'

const normalizeReportUrl = (url = '') => {
  const [reportUrl] = url.match(/((\d|\w){24})/);
  return `${BOWERY_APP_DOMAIN}/report/${reportUrl}`;
};

export const getLastVisitedReports = async () => {
  const response = await chrome.runtime.sendMessage({type: 'GET_LAST_REPORTS'})
  return response
};


export const getInitialRentCompValues = () =>{
  return new Promise((resolve, reject) => {

    async function extensionListener({ type, data, error },sender, sendResponse) {
      if (error) {
        return reject(new Error(error));
      }

      if (type === EVENTS.COMP_PARSED) {
        chrome.runtime.onMessage.removeListener(extensionListener);
        fetchProperty({ address: data.address, city: data.city, zip: data.zip })
          .then(property => {
            resolve({ ...data, block: property.block, lot: property.lot, borough: property.borough });
          })
          .catch((err) => {
            resolve(data);
          });
      }
      sendResponse()
      return true

    }
    chrome.runtime.onMessage.addListener(extensionListener);
    chrome.runtime.sendMessage({ type: EVENTS.INITIALIZE });

  });
}