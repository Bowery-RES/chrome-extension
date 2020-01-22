import axios from 'axios';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import { EVENTS } from '../constants';
import { BOWERY_APP_DOMAIN } from 'secrets';
import ChromeService from './ChromeService'

const normalizeReportUrl = (url = '') => {
  const [reportUrl] = url.match(/((\d|\w){24})/);
  return `${BOWERY_APP_DOMAIN}/report/${reportUrl}`;
};

class BoweryService {
  constructor({ domain = BOWERY_APP_DOMAIN }) {
    this.domain = domain;
  }

  async getAuthenticatedUser({ token }) {
    const response = await axios.get(`${this.domain}/user/authenticated-user`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' }
    });
    return response.data
  }

  async getAuthHeaders() {
    const token = await ChromeService.getToken();
    return { Authorization: token ? `Bearer ${token}` : '' };
  };

  async fetchReport(url) {
    if (!url) {
      return null;
    }
    const match = url.match(/((\d|\w){24})/);
    if (!match) {
      throw new Error('Not a valid URL');
    }
    const [id] = match;
    const headers = await this.getAuthHeaders();
    const response = await axios.get(`${this.domain}/report/${id}`, {
      headers,
    });

    return response.data;
  };

  async addUnitComp(url, unitComp) {
    const [id] = url.match(/((\d|\w){24})/) || [];
    if (!id) {
      throw new Error('Invalid parameters')
    }
    const headers = await this.getAuthHeaders();
    await axios.post(`${BOWERY_APP_DOMAIN}/report/${id}/addUnitComp`, unitComp, {
      headers
    });
    ChromeService.emit({ type: EVENTS.COMP_ADDED })
  };

  async getPropertyData(params) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${BOWERY_APP_DOMAIN}/api/propertySearch/ny/address`, {
        params,
        headers,
      });
      return get(response, 'data.0', {});
    } catch (error) {
      console.log(error)
    }
    return {}
  };

  async getLastVisitedReports() {
    const pages = await ChromeService.getDomainUrlsFromHistory(BOWERY_APP_DOMAIN);
    const reportsVisited = pages.filter(page =>
      page.url.match(/\/report\/(\d|\w){24}/)
      && page.url.startsWith(BOWERY_APP_DOMAIN)
      && page.title !== 'Bowery');

    const reports = reportsVisited.map(page => ({
      value: normalizeReportUrl(page.url),
      label: page.title,
    }));
    return uniqBy(reports, 'value').slice(0, 5)
  }
}

export default new BoweryService({})

