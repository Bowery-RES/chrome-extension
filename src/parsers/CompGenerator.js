import get from 'lodash/get'
import { createClient } from '@google/maps'
import { GOOGLE_API_KEY } from 'secrets'
import { GEOGRAPHY_OPTIONS, GOOGLE_ADDRESS_BOROUGH, EVENTS } from '../constants'
import ChromeService from '../services/ChromeService'
import BoweryService from '../services/BoweryService'
import transformCity from './transformers/mapCity'
import ErrorService from '../services/ErrorService'

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
    const addressInfo = get(response, 'json.results.0') || {}
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
      address: [get(location, 'street_number.long'), get(location, 'route.long')].filter(Boolean).join(' '),
      city: city ? city.short : '',
      zip: location.postal_code ? location.postal_code.short : '',
      state,
      locationIdentifier,
      coords,
    }
  }

  async parse() {
    try {
      let comp
      try {
        comp = this.parser.parse()
      } catch (error) {
        throw new Error(ErrorService.messages().PARSING, { cause: error })
      }

      let location
      try {
        location = await CompGenerator.getLocationInfoFromAddress(comp)
      } catch (error) {
        throw new Error(ErrorService.messages().GOOGLE, { cause: error })
      }

      let propertyData
      try {
        propertyData = await BoweryService.getPropertyData(location)
      } catch (error) {
        throw new Error(ErrorService.messages().WEBAPP, { cause: error })
      }

      const extendedProperty = {
        ...comp,
        ...location,
        ...propertyData,
        chromeExtensionVersion: process.env.VERSION,
      }
      this.emit({ data: extendedProperty })
    } catch (error) {
      ChromeService.emit({ type: EVENTS.COMP_PARSE_FAILED, data: ErrorService.serialize(error) })
    }
  }

  transform(data, middlewares = [(dataToTransform) => dataToTransform]) {
    return middlewares.reduce((transformedData, fn) => fn(transformedData), data)
  }

  emit({ type = EVENTS.COMP_PARSED, data }) {
    ChromeService.emit({ type, data: this.transform(data, [transformCity]) })
  }
}
