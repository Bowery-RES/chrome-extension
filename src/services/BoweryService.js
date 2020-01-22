import axios from 'axios'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import pick from 'lodash/pick'
import { BOWERY_APP_DOMAIN } from 'secrets'
import { EVENTS } from '../constants'
import ChromeService from './ChromeService'

const normalizeReportUrl = (url = '', domain) => {
  const [reportUrl] = url.match(/((\d|\w){24})/)
  return `${domain}/report/${reportUrl}`
}

class BoweryService {
  constructor({ domain = BOWERY_APP_DOMAIN }) {
    this.domain = domain
  }

  async getAuthenticatedUser({ token }) {
    const response = await axios.get(`${this.domain}/user/authenticated-user`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    })
    return response.data
  }

  async getAuthHeaders() {
    const token = await ChromeService.getToken()
    return { Authorization: token ? `Bearer ${token}` : '' }
  }

  async fetchReport(url) {
    if (!url) {
      return null
    }
    const match = url.match(/((\d|\w){24})/)
    if (!match) {
      throw new Error('Not a valid URL')
    }
    const [id] = match
    const headers = await this.getAuthHeaders()
    const response = await axios.get(`${this.domain}/report/${id}`, {
      headers,
    })

    return response.data
  }

  async addUnitComp(url, unitComp) {
    const [id] = url.match(/((\d|\w){24})/) || []
    if (!id) {
      throw new Error('Invalid parameters')
    }
    const headers = await this.getAuthHeaders()
    await axios.post(`${this.domain}/report/${id}/addUnitComp`, unitComp, {
      headers,
    })
    ChromeService.emit({ type: EVENTS.COMP_ADDED, data: { source: unitComp.sourceName } })
  }

  getPropertyRequest(location) {
    switch (location.locationIdentifier) {
      case 'New York':
        return {
          endpoint: `${this.domain}/api/propertySearch/ny/address`,
          params: {
            zip: location.zip,
            city: location.city,
            address: location.address,
          },
          transform: (data) => ({ block: data.block, lot: data.lot, borough: data.borough }),
        }
      case 'New Jersey':
        return {
          endpoint: `${this.domain}/api/propertySearch/nj/address`,
          params: {
            zip: location.zip,
            address: location.address,
            district: location.city,
          },
          transform: (data) => ({ block: data.block, lot: data.lot, qualifier: data.qual }),
        }
      default:
        throw new Error('Unknown location identifier')
    }
  }

  async getPropertyData(location) {
    try {
      const { params, endpoint, transform } = this.getPropertyRequest(location)
      const headers = await this.getAuthHeaders()
      const response = await axios.get(endpoint, { params, headers })
      const result = get(response, 'data.0', {})
      return transform(result)
    } catch (error) {
      console.log(error)
    }
    return {}
  }

  async getLastVisitedReports() {
    const pages = await ChromeService.getDomainUrlsFromHistory(this.domain)
    const reportsVisited = pages.filter((page) => page.url.match(/\/report\/(\d|\w){24}/)
      && page.url.startsWith(this.domain)
      && page.title !== 'Bowery')

    const reports = reportsVisited.map((page) => ({
      value: normalizeReportUrl(page.url, this.domain),
      label: page.title,
    }))
    return uniqBy(reports, 'value').slice(0, 5)
  }
}

export default new BoweryService({})
