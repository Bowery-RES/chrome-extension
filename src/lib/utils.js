import uniqBy from 'lodash/uniqBy';
import { BOWERY_APP_DOMAIN } from 'secrets';
import { fetchProperty } from '@lib/api';
import { EVENTS } from '../lib/constants'
const normalizeReportUrl = (url = '') => {
  const [reportUrl] = url.match(/((\d|\w){24})/);
  return `${BOWERY_APP_DOMAIN}/report/${reportUrl}`;
};

export const getLastVisitedReports = async () => {
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


export const getInitialRentCompValues = () =>
  new Promise((resolve, reject) => {
    function extensionListener({ type, data, error }) {
      if (error) {
        reject(new Error(error));
      }

      if (type === EVENTS.COMP_PARSED) {
        fetchProperty({ address: data.address, city: data.city, zip: data.zip })
          .then(property => {
            resolve({ ...data, block: property.block, lot: property.lot, borough: property.borough });
          })
          .catch((err) => {
            console.log(err)
            resolve(data);
          });

        chrome.runtime.onMessage.removeListener(extensionListener);
      }
    }
    chrome.runtime.onMessage.addListener(extensionListener);
    chrome.runtime.sendMessage({ type: EVENTS.INITIALIZE });
  });
