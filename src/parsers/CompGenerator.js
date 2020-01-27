import get from 'lodash/get'
import { createClient } from '@google/maps'
import { GOOGLE_API_KEY } from 'secrets'
import { GEOGRAPHY_OPTIONS, GOOGLE_ADDRESS_BOROUGH, EVENTS } from '../constants'
import ChromeService from '../services/ChromeService'
import BoweryService from '../services/BoweryService'

const googleMapsClient = createClient({
  key: GOOGLE_API_KEY,
  Promise,
})

export default class CompGenerator {
  constructor({ parser }) {
    this.parser = parser
  }

  static async getLocationInfoFromAddress({ address = '', zip }) {
    const response = await googleMapsClient.geocode({ address: `${address} ${zip}` }).asPromise()
    const addressInfo = get(response, 'json.results.0')
    const location = {}

    const addressComponents = get(addressInfo, 'address_components') || []
    // eslint-disable-next-line no-restricted-syntax
    for (const part of addressComponents) {
      part.types.forEach((type) => {
        location[type] = { short: part.short_name, long: part.long_name }
      })
    }
    let borough = {}

    const state = get(location, 'administrative_area_level_1.short')
    let city = location.locality || addressInfo.sublocality || addressInfo.neighborhood

    if (state === 'NJ') {
      city = get(location, 'administrative_area_level_3') || get(location, 'locality')
    } else if (state === 'NY') {
      city = location.sublocality || location.locality || {}
      borough = {
        short: GOOGLE_ADDRESS_BOROUGH[city.short],
        long: GOOGLE_ADDRESS_BOROUGH[city.long],
      }
    }

    let locationIdentifier = GEOGRAPHY_OPTIONS[state] || GEOGRAPHY_OPTIONS.OTHER

    if (state === 'NY' && !borough.long) {
      locationIdentifier = GEOGRAPHY_OPTIONS.OTHER
    }
    const coords = {
      longitude: get(addressInfo, 'geometry.location.lng'),
      latitude: get(addressInfo, 'geometry.location.lat'),
    }

    return {
      address: `${get(location, 'street_number.long')} ${get(location, 'route.long')}`,
      city: city ? city.short : '',
      zip: location.postal_code ? location.postal_code.short : '',
      state,
      locationIdentifier,
      coords,
    }
  }


  async parse() {
    const comp = this.parser.parse()
    const location = await CompGenerator.getLocationInfoFromAddress(comp)
    const propertyData = await BoweryService.getPropertyData(location)
    const extendedProperty = {
      ...comp,
      ...location,
      ...propertyData,
    }
    ChromeService.emit({ type: EVENTS.COMP_PARSED, data: extendedProperty })
  }
}
