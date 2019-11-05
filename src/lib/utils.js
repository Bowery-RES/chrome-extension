import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import map from 'lodash/map';
import { BOWERY_APP_DOMAIN } from 'secrets';

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

            if (type === 'comp-parsed') {
                resolve(data);
                chrome.extension.onRequest.removeListener(extensionListener);
            }
        }
        chrome.extension.onRequest.addListener(extensionListener);
        chrome.extension.sendRequest({ type: 'popup-opened' });
    });
