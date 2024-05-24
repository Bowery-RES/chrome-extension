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
    const laundry = $(':contains("Appliances")').parent().find('ul > li > span:contains(Laundry)').text().trim()
    if (!laundry) {
      return []
    }

    const ZILLOW_AMENITIES_INCLUDED = []
    Object.entries(ZILLOW_AMENITIES_MAP).forEach(([key, value]) => {
      if (laundry.includes(key)) {
        ZILLOW_AMENITIES_INCLUDED.push(value)
      }
    })

    return UNIT_AMENITIES_LIST.filter((amenity) => ZILLOW_AMENITIES_INCLUDED.includes(amenity.value))
  }

  get dateOfValue() {
    try {
      const priceHistory = $(':contains("Price history")').parent()
      if (!priceHistory) {
        return null
      }

      const dateOfValue = priceHistory.find('table tbody td > span').first().text().trim()
      const date = new Date(dateOfValue)

      return isNaN(date.getTime()) ? null : date.toISOString()
    } catch (error) {
      console.warn({ error })
      return null
    }
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
      fullAddress: fullAddress || '',
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
    let resultOfParsing = {}

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

    const { bedrooms, sqft, bathrooms, fullAddress, streetAddress, zip, city, state } = resultOfParsing
    const [, , , unitNumber] = (fullAddress || '').match(/(.*) (#|APT) *(\w+|\d+)/) || []

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
