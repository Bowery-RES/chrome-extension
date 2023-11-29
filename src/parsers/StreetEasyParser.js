import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import startCase from 'lodash/startCase'
import isNaN from 'lodash/isNaN'
import intersection from 'lodash/intersection'
import $ from 'jquery'
import { UNIT_AMENITIES_LIST, SOURCES_MAP, STREET_EASY_AMENITIES_MAP } from '../constants'

export default class StreetEasyParser {
  constructor({ document }) {
    this.document = document
    this.source = SOURCES_MAP[this.document.location.hostname]
  }

  parse() {
    const [, data = '[]'] = this.document.body.textContent.match(/dataLayer = (\[.*\]);/) || []
    const [compData] = JSON.parse(data)
    this.compData = compData

    const buildingTitle = $('.building-title .incognito').text()
    const [, , , unitNumber] = buildingTitle.match(/(.*) (#|UNIT-)(.*)/) || []

    const [unitLayout] =
      this.description.match(new RegExp(/(duplex|triplex|simplex|penthouse|loft|garden style|basement|garage)/, 'i')) ||
      []

    const zip = get(compData, 'listZip')
    const address = $('.backend_data.BuildingInfo-item').text().trim().replace(/\n/g, ' ').replace(/\s+/g, ' ')

    const result = {
      dateOfValue: this.dateOfValue,
      unitLayout: startCase(unitLayout),
      unitNumber,
      address,
      zip,
      rooms: get(compData, 'listRoom'),
      bedrooms: get(compData, 'listBed', 0),
      bathrooms: get(compData, 'listBath', 0),
      sqft: get(compData, 'listSqFt', 0),
      rent: get(compData, 'listPrice', null),
      amenities: isEmpty(this.amenities) ? null : this.amenities,
      internalNotes: this.hasElevator ? 'Building has an elevator' : '',
      sourceOfInformation: 'externalDatabase',
      sourceUrl: this.document.location.toString(),
      sourceName: this.source,
    }
    return result
  }

  get dateOfValue() {
    try {
      const propertyHistory = $('h2:contains("Property History")').parent()
      if (!propertyHistory) {
        return null
      }

      let targetTableIndex
      const tabs = propertyHistory.find('[class*="History"] button > span').each((index, elem) => {
        if (elem.innerText === 'Price history') {
          targetTableIndex = index
        }
      })

      if (!tabs || targetTableIndex === undefined) {
        return null
      }

      const dateOfValue = propertyHistory
        .find('[class*="History"] table')
        .eq(targetTableIndex)
        .find(`tbody td`)
        .first()
        .text()
        .trim()

      const date = new Date(dateOfValue)
      return isNaN(date.getTime()) ? null : date.toISOString()
    } catch (error) {
      console.warn({ error })

      return null
    }
  }

  get description() {
    let description = $('[data-qa="description-block"]').text().trim()
    if (!description) {
      description = $('h2:contains("Description")').parent().text().trim()
    }

    return description || ''
  }

  get hasElevator() {
    const amenitiesList = get(this.compData, 'listAmen', '')
    return /elevator/.test(amenitiesList)
  }

  get amenities() {
    const amenitiesList = get(this.compData, 'listAmen', '').split('|')
    const unitAmenities = intersection(Object.keys(STREET_EASY_AMENITIES_MAP), amenitiesList)
    return unitAmenities.map((amenity) =>
      UNIT_AMENITIES_LIST.find((pair) => pair.value === STREET_EASY_AMENITIES_MAP[amenity])
    )
  }
}
