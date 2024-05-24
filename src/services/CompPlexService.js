import axios from 'axios'
import get from 'lodash/get'
import camelCase from 'lodash/camelCase'
import { COMPPLEX_DOMAIN } from 'secrets'
import AuthService from './AuthService'
import { UnitCompDTOTemplate, createDTO } from '../entities'
import ErrorService from './ErrorService'

class CompPlexService {
  constructor({ domain = COMPPLEX_DOMAIN } = {}) {
    this.domain = domain
  }

  async addUnitComp(unitCompData) {
    try {
      const { user } = await AuthService.authenticate()

      const residentialLeaseInput = this.mapUnitComp(unitCompData, user)

      const body = {
        query: this.upsertResidentialLeaseByAddressQuery(),
        variables: { input: residentialLeaseInput },
      }

      const response = await axios.post(this.domain, JSON.stringify(body), {
        headers: { 'Content-Type': 'application/json' },
      })
      const errors = get(response, 'data.errors')
      if (errors) {
        console.warn('[CompPlexService] addUnitComp', errors)
        const stringifiedErrors = JSON.stringify(errors)
        throw new Error(stringifiedErrors)
      }
      const data = get(response, 'data.data.upsertResidentialLeaseByAddress')
      return data
    } catch (error) {
      console.error('Error adding UnitComp to CompPlex', { error })
      throw new Error(ErrorService.messages().COMPPLEX, { cause: error })
    }
  }

  mapUnitComp(unitCompDataUntyped, user) {
    const mapAmenity = (amenity) => {
      if (amenity === 'unitLaundry') {
        return 'inUnitLaundry'
      }
      return amenity
    }

    const unitCompData = createDTO({ data: unitCompDataUntyped }, UnitCompDTOTemplate)

    return {
      address: {
        streetAddress: unitCompData.address,
        city: unitCompData.city,
        state: unitCompData.state,
        postalCode: unitCompData.zip,
        coords: {
          latitude: get(unitCompData, 'coords.latitude'),
          longitude: get(unitCompData, 'coords.longitude'),
        },
      },
      leaseDate: unitCompData.dateOfValue,
      unitNumber: unitCompData.unitNumber,
      numberOfBedrooms: unitCompData.bedrooms,
      leaseInformation: {
        monthlyRent: unitCompData.rent,
        rentType: 'marketRate',
        unitAmenities: unitCompData.amenities.map(mapAmenity),
        unitType: unitCompData.unitLayout ? camelCase(unitCompData.unitLayout) : null,
        unitSquareFootage: unitCompData.sqft,
        numberOfBathrooms: String(unitCompData.bathrooms),
      },
      resourceInformation: {
        sources: [
          {
            type: unitCompData.sourceOfInformation,
            url: unitCompData.sourceUrl,
          },
        ],
      },
      commentary: {
        internalNotes: unitCompData.internalNotes,
      },
      createdBy: user.email,
    }
  }

  upsertResidentialLeaseByAddressQuery() {
    return `mutation upsertResidentialLeaseByAddress($input: UpsertResidentialLeaseByAddressInput!) {
          upsertResidentialLeaseByAddress(input: $input) {
            id
            version
        }
      }`
  }
}

export default new CompPlexService()
