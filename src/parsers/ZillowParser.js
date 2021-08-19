import $ from 'jquery'
import get from 'lodash/get'
import startCase from 'lodash/startCase'
import trim from 'lodash/trim'
import isEmpty from 'lodash/isEmpty'
import { ZILLOW_AMENITIES_MAP, UNIT_AMENITIES_LIST, SOURCES_MAP } from '../constants'

export default class ZillowParser {
  constructor({ document }) {
    this.document = document
    this.source = SOURCES_MAP[this.document.location.hostname]
  }

  get amenities() {
    const laundry = $('.ds-standard-label.ds-home-fact-label')
      .filter(function findLaundry() {
        return $(this).text() === 'Laundry:'
      })
      .next('.ds-home-fact-value')
      .text()
    return UNIT_AMENITIES_LIST.filter((amenity) => amenity.value === ZILLOW_AMENITIES_MAP[laundry])
  }

  get dateOfValue() {
    const dateOfValueRaw = $('.ds-expandable-card-section-flush-padding tr:first-child td:first-child').first().text().trim()
    const date = new Date(dateOfValueRaw)
    return isNaN(date.getTime()) ? null : date.toISOString()
  }

  get rent() {
    const rent = $('.ds-home-details-chip .ds-summary-row h4')
      .first()
      .text()
      .replace(/[^0-9.-]+/g, '') || $('.ds-expandable-card-section-flush-padding tr:first-child td:nth-child(3) span:first-child').contents().get(0).nodeValue.replace(/[^0-9.-]+/g, '')
    return +rent
  }

  parse() {
    const { rent } = this

    const [bedrooms, bathrooms, sqft] = $('.ds-home-details-chip .ds-bed-bath-living-area')
      .get()
      .map(
        (element) => +$(element)
          .text()
          .trim()
          .replace(/[^0-9.-]+/g, '') || 0,
      )

    const [, id] = document.location.href.match(/(\w+)_zpid/)
    const description = $('.ds-overview-section').text().trim()
    const [unitLayout] = description.match(/(duplex|triplex|simplex|penthouse|loft|garden style|basement|garage)/) || []

    const script = $(`article#zpid_${id}`).prev("script[type='application/ld+json']").text()
    let city
    let zip
    let streetAddress
    let state

    const [, , , unitNumber] = $('.ds-price-change-address-row')
      .children()
      .first()
      .text()
      .match(/(.*) (#|APT) *(\w+|\d+)/) || []

    if (!script) {
      streetAddress = $('.ds-price-change-address-row').children().first().text()
      const address = $('.ds-price-change-address-row').children().last().text()
      const matches = address.match(/(.*), (\w+) (\w+)/) || []
      city = trim(matches[1])
      state = trim(matches[2])
      zip = trim(matches[3])
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
      unitLayout: startCase(unitLayout),
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
