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
    const laundry = $('.ds-standard-label.ds-home-fact-label').filter(function findLaundry() {
      return $(this).text() === 'Laundry:'
    }).next('.ds-home-fact-value').text()
    return UNIT_AMENITIES_LIST.filter((amenity) => amenity.value === ZILLOW_AMENITIES_MAP[laundry])
  }

  parse() {
    const rent = +$('.ds-home-details-chip .ds-price .ds-value')
      .first()
      .text()
      .replace(/[^0-9.-]+/g, '')

    const [bedrooms, bathrooms, sqft] = $('.ds-home-details-chip .ds-bed-bath-living-area').get()
      .map((element) => +$(element).text().trim().replace(/[^0-9.-]+/g, ''))

    const [, id] = document.location.href.match(/(\w+)_zpid/)
    const description = $('.ds-overview-section').text().trim()
    const [unitLayout] = description.match(/(duplex|triplex|simplex|penthouse|loft|garden style|basement|garage)/) || []
    const dateOfValue = $('.ds-price-and-tax-section-table tr:first-child td:first-child')
      .first().text().trim()
    const script = $(`article#zpid_${id}`).prev("script[type='application/ld+json']").text()
    let city
    let zip
    let streetAddress
    let state


    const [, , , unitNumber] = $('.ds-address-container')
      .children()
      .first()
      .text()
      .match(/(.*) (#|APT) (\w+|\d+)/) || []

    if (!script) {
      streetAddress = $('.ds-address-container').children().first().text()
      const address = $('.ds-address-container').children().last().text()
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
      sqft: sqft || 0,
      bathrooms,
      rent,
      unitNumber,
      unitLayout: startCase(unitLayout),
      dateOfValue: new Date(dateOfValue).toISOString(),
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
