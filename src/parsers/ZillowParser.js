import $ from 'jquery'
import trim from 'lodash/trim'
import isNaN from 'lodash/isNaN'
import isEmpty from 'lodash/isEmpty'
import { ZILLOW_AMENITIES_MAP, UNIT_AMENITIES_LIST, SOURCES_MAP } from '../constants'
import { getUnitLayout, extractNumber } from '../helpers'

export default class ZillowParser {
  constructor({ document }) {
    this.document = document
    this.source = SOURCES_MAP[this.document.location.hostname]
  }

  get rentContainer() {
    return $('#ds-container .ds-data-col').length
  }

  get saleContainer() {
    return $('.data-column-container .summary-container').length
  }

  get amenities() {
    const laundry = $('#ds-data-view ul > li > span:contains(Laundry:)').next('span').text().trim()
    return UNIT_AMENITIES_LIST.filter((amenity) => amenity.value === ZILLOW_AMENITIES_MAP[laundry])
  }

  get dateOfValue() {
    const dateOfValueRaw = $('.ds-expandable-card-section-flush-padding tr:first-child td:first-child')
      .first()
      .text()
      .trim()
    const date = new Date(dateOfValueRaw)
    return isNaN(date.getTime()) ? null : date.toISOString()
  }

  get rent() {
    const { saleContainer, rentContainer } = this
    let element
    if (saleContainer) {
      element = $('.data-column-container .summary-container span:contains("Est.")').next()
    } else if (rentContainer) {
      element = $('#ds-container .ds-data-col [data-testid="price"]')
    } else {
      return null
    }
    const rentValue = element ? element.text() : null
    const rent = rentValue ? rentValue.split('/')[0] : null
    return extractNumber(rent)
  }

  parseHandler(roomStr, addressStr) {
    const [bedroomsValue, , bathroomsValue, , sqftValue] = $(roomStr)
      .children()
      .map(
        (index, element) =>
          +$(element)
            .text()
            .trim()
            .replace(/[^0-9.-]+/g, '') || 0
      )
    const fullAddress = $(addressStr).text()
    const matches = fullAddress.match(/(.*), (\w+) (\w+)/) || []
    const [streetValue, cityValue] = trim(matches[1]).split(',')
    return {
      bedrooms: bedroomsValue || '',
      bathrooms: bathroomsValue || '',
      sqft: sqftValue || '',
      streetAddress: streetValue || '',
      city: cityValue || '',
      state: trim(matches[2]) || '',
      zip: trim(matches[3]) || '',
    }
  }

  parse() {
    const { rent, saleContainer, rentContainer } = this
    const description = $('.ds-overview-section').text().trim()
    const unitLayout = getUnitLayout(description)
    let resultOfParsing

    if (saleContainer) {
      resultOfParsing = this.parseHandler(
        '.data-column-container .summary-container [data-testid="bed-bath-beyond"]',
        '.data-column-container .summary-container h1'
      )
    }
    if (rentContainer) {
      resultOfParsing = this.parseHandler(
        '#ds-container .ds-data-col [data-testid="bed-bath-beyond"]',
        '#ds-container .ds-data-col h1'
      )
    }

    const [, , , unitNumber] =
      $('.ds-price-change-address-row')
        .children()
        .first()
        .text()
        .match(/(.*) (#|APT) *(\w+|\d+)/) || []

    const { bedrooms, sqft, bathrooms, streetAddress, zip, city, state } = resultOfParsing

    const result = {
      bedrooms,
      sqft,
      bathrooms,
      rent,
      unitNumber,
      unitLayout,
      dateOfValue: this.dateOfValue,
      sourceOfInformation: 'externalDatabase',
      sourceUrl: this.document.location.toString(),
      sourceName: this.source,
      address: streetAddress,
      zip,
      city,
      state,
      amenities: isEmpty(this.amenities) ? null : this.amenities,
    }
    return result
  }
}
