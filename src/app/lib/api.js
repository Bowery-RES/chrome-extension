import axios from 'axios';
import get from 'lodash/get';
import 'chrome-extension-async';
import { GOOGLE_API, EVENTS } from './constants';
import { GOOGLE_API_KEY, BOWERY_APP_DOMAIN } from 'secrets';

const getAuthHeaders = async () => {
  const { token } = await chrome.storage.local.get('token');
  return { Authorization: token ? `Bearer ${token}` : '' };
};

export const geocodeByAddress = async ({ address, zip }) => {
  const response = await axios.get(GOOGLE_API, {
    params: { address, zip, key: GOOGLE_API_KEY },
  });
  return get(response, 'data.results.0');
};

export const fetchReport = async url => {
  if (!url) {
    return null;
  }
  const match = url.match(/((\d|\w){24})/);
  if (!match) {
    throw new Error('Not a valid URL');
  }
  const [id] = match;
  const headers = await getAuthHeaders();
  const response = await axios.get(`${BOWERY_APP_DOMAIN}/report/${id}`, {
    headers: headers,
  });

  return response.data;
};

export const addUnitComp = async (url, unitComp) => {
  const [id] = url.match(/((\d|\w){24})/);
  const headers = await getAuthHeaders();
  await axios.post(`${BOWERY_APP_DOMAIN}/report/${id}/addUnitComp`, unitComp, {
    headers: headers,
  });
  chrome.runtime.sendMessage({ type: EVENTS.COMP_ADDED });
};

export const fetchProperty = async params => {
  return {}
  const headers = await getAuthHeaders();
  const response = await axios.get(`${BOWERY_APP_DOMAIN}/api/propertySearch/ny/address`, {
    params,
    headers,
  });
  return get(response, 'data.0', {});
};
