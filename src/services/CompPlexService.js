import axios from 'axios'
import get from 'lodash/get'
import camelCase from 'lodash/camelCase'
import { COMPPLEX_DOMAIN } from 'secrets'
import AuthService from './AuthService'

class CompPlexService {
  constructor({ domain = COMPPLEX_DOMAIN } = {}) {
    this.domain = domain
  }

  async addUnitComp(unitCompData) {
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
    const data = get(response, 'data.data')
    return data
  }

  mapUnitComp(unitCompData, user) {
    const mapAmenity = (amenity) => {
      if (amenity === 'unitLaundry') {
        return 'inUnitLaundry'
      }
      return amenity
    }

    return {
      address: {
        streetAddress: unitCompData.address,
        city: unitCompData.city,
        state: unitCompData.state,
        postalCode: unitCompData.zip,
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
            isLatestVersion
            address {
              streetAddress
                city
                state
                postalCode
                coords {
                    latitude
                    longitude
                }
                propertyIdentification {
                    propertyIdentifierType
                    propertyIdentifier
                }
            }
            propertyInformation {
              photo {
                cdnUrl
                fileName
                isLandscape
              }
            }
            leaseDate
            unitNumber
            numberOfBedrooms
            status
            leaseInformation {
                monthlyRent
                unitSquareFootage
                numberOfBathrooms
                unitType
                unitAmenities
            }
            resourceInformation {
              sources {
                type
                url
                document {
                  fileName
                  namespace
                  fileId
                  createdDate
                }
                id
              }
            }
          }
        }`
  }
}

export default new CompPlexService()
