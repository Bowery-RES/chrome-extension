import $ from 'jquery'
import get from 'lodash/get'
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
    const element = $('.data-column-container .summary-container span:contains("Est.")').next()
    const rentValue = element ? element.text() : null
    const rent = rentValue ? rentValue.split('/')[0] : null
    return extractNumber(rent)
  }

  parse() {
    const { rent } = this
    const [bedrooms, , bathrooms, , sqft] = $(
      '.data-column-container .summary-container [data-testid="bed-bath-beyond"]'
    )
      .children()
      .map(
        (index, element) =>
          +$(element)
            .text()
            .trim()
            .replace(/[^0-9.-]+/g, '') || 0
      )

    const [, id] = document.location.href.match(/(\w+)_zpid/)
    const description = $('.ds-overview-section').text().trim()
    const unitLayout = getUnitLayout(description)

    const script = $(`article#zpid_${id}`).prev("script[type='application/ld+json']").text()
    let city
    let zip
    let streetAddress
    let state

    const [, , , unitNumber] =
      $('.ds-price-change-address-row')
        .children()
        .first()
        .text()
        .match(/(.*) (#|APT) *(\w+|\d+)/) || []

    if (!script) {
      const fullAddress = $('.data-column-container .summary-container h1').text()
      const matches = fullAddress.match(/(.*), (\w+) (\w+)/) || []
      const [streetValue, cityValue] = trim(matches[1]).split(',')
      streetAddress = streetValue || ''
      city = cityValue || ''
      state = trim(matches[2]) || ''
      zip = trim(matches[3]) || ''
    } else {
      const data = JSON.parse(script)
      streetAddress = get(data, 'address.streetAddress')
      city = get(data, 'address.addressLocality')
      state = get(data, 'address.addressRegion')
      zip = get(data, 'address.postalCode')
    }

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
