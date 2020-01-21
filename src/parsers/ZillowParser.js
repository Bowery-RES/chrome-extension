import jq from 'jquery';
import get from 'lodash/get'
export default class ZillowParser {
  constructor({ document }) {
    this.document = document;
    this.source = 'Zillow'
  }
  async getPropertyData() {
    return {}
  }
  parse() {

    const rent = +jq(".ds-home-details-chip .ds-price .ds-value")
      .first()
      .text()
      .replace(/[^0-9.-]+/g, "")

    const [bedrooms, bathrooms, sqft] = jq(".ds-home-details-chip .ds-bed-bath-living-area").get()
      .map(element => parseInt(element.textContent))

    const [, id] = document.location.href.match(/(\w+)_zpid/)
    const [, unitNumber] = jq(".ds-address-container")
      .children()
      .first()
      .text()
      .match(/(.*) # (\w|\d)+/) || []

    const description = jq(".ds-overview-section").text().trim()
    const [unitLayout] = description.match(/(duplex|triplex|simplex|penthouse|loft|garden style|basement|garage)/) || []
    const dateOfValue = jq(".ds-price-and-tax-section-table tr:first-child td:first-child")
      .first().text().trim();
    const script = jq(`article#zpid_${id}`).prev("script[type='application/ld+json']").text()
    const data = JSON.parse(script)
    const {streetAddress, addressLocality: city, addressRegion: state, postalCode: zip} = get(data, 'address') || {}
    // const address = jq(".ds-address-container").children().last().text()
    // const [city, state, zip] = address.match(/(.*)\, (\w+) (\w+)/)

    const result = {
      bedrooms,
      sqft,
      bathrooms,
      rent,
      unitNumber,
      unitLayout,
      dateOfValue: new Date(dateOfValue).toISOString(),
      sourceOfInformation: 'externalDatabase',
      sourceUrl: this.document.location.toString(),
      sourceName: this.source,
      address: streetAddress,
      zip,
      city,
      state,

      amenities: null,

    };
    return result
  }
}