import $ from 'jquery'
import { SOURCES_MAP } from '../constants'
import { extractNumber, getUnitLayout } from '../helpers'

export default class WRParser {
  constructor({ document }) {
    this.document = document
    this.source = SOURCES_MAP[this.document.location.hostname]
  }

  parse() {
    const streetAddress = $('.address-info .medText').text()
    const [descriptionShort, rentString, sqftString] = $('.listing-info .divTableRowSingle')
      .children()
      .map((index, element) => $(element).text())
      .slice(1, 4)

    const dateOfValue = new Date().toISOString()

    const rent = extractNumber(rentString)
    const sqft = extractNumber(sqftString)

    const bedrooms = descriptionShort.match(/(\d+) BD/)[1]
    const bathrooms = descriptionShort.match(/(\d+) BA/)[1]
    const unitNumber = descriptionShort.match(/Unit (\d+)/)[1]

    const profileDesctioption = $('.profile-description').text()
    const unitLayout = getUnitLayout(profileDesctioption)

    const amenities = []

    const result = {
      bedrooms,
      sqft,
      bathrooms,
      rent,
      unitNumber,
      unitLayout,
      dateOfValue,
      sourceOfInformation: 'externalDatabase',
      sourceUrl: this.document.location.toString(),
      sourceName: this.source,
      address: streetAddress,
      amenities,
    }
    return result
  }
}
