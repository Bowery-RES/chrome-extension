import axios from 'axios'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import { BOWERY_APP_DOMAIN } from 'secrets'
import { EVENTS } from '../constants'
import { createDTO, UnitComp, UnitCompDTOTemplate } from '../entities'
import ChromeService from './ChromeService'
import ErrorService from './ErrorService'

const getReportId = (url = '') => {
  const [reportUrl] = url.match(/((\d|\w){24})/)
  return reportUrl
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

  async addUnitComp(url, compPlexComp, unitCompData) {
    try {
      const [id] = url.match(/((\d|\w){24})/) || []
      if (!id) {
        throw new Error('Invalid parameters')
      }

      const headers = await this.getAuthHeaders()
      const unitComp = new UnitComp({
        ...unitCompData,
        leaseId: compPlexComp.id,
        leaseVersionNumber: compPlexComp.version,
      })
      const unitCompDTO = createDTO(unitComp, UnitCompDTOTemplate)
      await axios.post(`${this.domain}/report/${id}/addUnitComp`, unitCompDTO, {
        headers,
      })

      ChromeService.emit({ type: EVENTS.COMP_ADDED, data: { source: unitCompData.sourceName } })
    } catch (error) {
      throw new Error(ErrorService.messages().WEBAPP_SUBMIT, { cause: error })
    }
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
      // eslint-disable-next-line no-console
      console.log(error)
      return {}
    }
  }

  normalizeReportUrl(url) {
    const reportId = getReportId(url)
    return `${this.domain}/report/${reportId}`
  }

  async getLastVisitedReports() {
    const pages = await ChromeService.getDomainUrlsFromHistory(this.domain)
    const reportsVisited = pages.filter(
      (page) => page.url.match(/\/report\/(\d|\w){24}/) && page.url.startsWith(this.domain) && page.title !== 'Bowery'
    )

    const reports = reportsVisited.map((page) => ({
      value: getReportId(page.url),
      label: page.title,
    }))
    return uniqBy(reports, 'value').slice(0, 5)
  }
}

export default new BoweryService({})
