import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import startCase from 'lodash/startCase'
import intersection from 'lodash/intersection'
import words from 'lodash/words'
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
    const dateOfValue = $('.DetailsPage-priceHistory .Table tr:first-child .Table-cell--priceHistoryDate .Text')
      .text()
      .trim()
    const description = $('.Description-block').text().trim()
    const [unitLayout] = description.match(/(duplex|triplex|simplex|penthouse|loft|garden style|basement|garage)/) || []

    const zip = get(compData, 'listZip')
    const address = words($('.backend_data.BuildingInfo-item').text()).join(' ')
    const result = {
      dateOfValue: new Date(dateOfValue).toISOString(),
      unitLayout: startCase(unitLayout),
      unitNumber,
      address,
      zip,

      rooms: get(compData, 'listRoom'),
      bedrooms: get(compData, 'listBed') || null,
      bathrooms: get(compData, 'listBath'),
      sqft: get(compData, 'listSqFt', '') || 0,
      rent: get(compData, 'listPrice', ''),
      amenities: isEmpty(this.amenities) ? null : this.amenities,
      sourceOfInformation: 'externalDatabase',
      sourceUrl: this.document.location.toString(),
      sourceName: this.source,
    }

    return result
  }

  get amenities() {
    const amenitiesList = get(this.compData, 'listAmen', '').split('|')
    const unitAmenities = intersection(Object.keys(STREET_EASY_AMENITIES_MAP), amenitiesList)
    return unitAmenities.map((amenity) => UNIT_AMENITIES_LIST.find(
      (pair) => pair.value === STREET_EASY_AMENITIES_MAP[amenity],
    ))
  }
}
