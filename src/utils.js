import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import map from 'lodash/map'
import axios from 'axios';
import { BOWERY_APP_DOMAIN } from 'secrets';

export const getReportAddress = async reportUrl => {
    const { token } = await chrome.storage.local.get('token');
    const response = await axios.get(reportUrl, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return get(response, 'data.new.address');
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

    const reports = reportsVisited.map(page => {
        const [reportUrl] = get(page, 'url', '').match(/(\/report\/(\d|\w){24})/);
        return {
            value: `${BOWERY_APP_DOMAIN}${reportUrl}`,
            address: page.title,
        };
    });

    return uniqBy(reports, 'value').slice(0, 5);
};

export const submitRentComp = async (url, values) => {
    const { token } = await chrome.storage.local.get('token');
    const unitComp = {
        ...values,
        amenities: map(values.unitAmenities, 'value'),
    };
    await axios.post(`${url}/addUnitComp`, unitComp, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
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

export const validateToken = async token => {
    try {
        const response = await axios.get(`${BOWERY_APP_DOMAIN}/user/authenticated-user`, {
            headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
        return response.status === 200;
    } catch (error) {
        return false;
    }
};
