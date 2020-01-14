import uniqBy from 'lodash/uniqBy';
import { BOWERY_APP_DOMAIN } from 'secrets';
import { fetchProperty } from './api';
import { EVENTS } from './constants'

const normalizeReportUrl = (url = '') => {
  const [reportUrl] = url.match(/((\d|\w){24})/);
  return `${BOWERY_APP_DOMAIN}/report/${reportUrl}`;
};

export const getLastVisitedReports = async () => {
  return [];
  const history = await chrome.history.search({
    text: `${BOWERY_APP_DOMAIN}/report/`,
    startTime: Date.now() - 1008000000,
  });
  const reportsVisited = history.filter(
    page =>
      page.url.match(/(\/report\/(\d|\w){24})/) &&
      page.title !== 'Bowery' &&
      !BOWERY_APP_DOMAIN.includes(page.title),
  );

  const reports = reportsVisited.map(page => ({
    value: normalizeReportUrl(page.url),
    address: page.title,
  }));

  return uniqBy(reports, 'value').slice(0, 5);
};


export const getInitialRentCompValues = () =>{
console.log("ASDASDASDASd")
  return new Promise((resolve, reject) => {

    async function extensionListener({ type, data, error },sender, response) {
      console.log(type, data)
      if (error) {
        reject(new Error(error));
      }

      if (type === EVENTS.COMP_PARSED) {
        chrome.runtime.onMessage.removeListener(extensionListener);
        resolve(data);
        // fetchProperty({ address: data.address, city: data.city, zip: data.zip })
        //   .then(property => {
        //     resolve({ ...data, block: property.block, lot: property.lot, borough: property.borough });
        //   })
        //   .catch((err) => {
        //     console.log(err)
        //     resolve(data);
        //   });
      }

    }
    console.log(2)
    chrome.runtime.onMessage.addListener(extensionListener);
    console.log(3)
    chrome.runtime.sendMessage({ type: EVENTS.INITIALIZE }, console.log);
    console.log(4)

  });
}