import axios from 'axios'
import get from 'lodash/get'
import { COMPPLEX_DOMAIN } from 'secrets'

class CompPlexService {
  constructor({ domain = COMPPLEX_DOMAIN } = {}) {
    this.domain = domain
  }

  async addUnitComp(unitCompData) {
    const residentialLeaseInput = {
      address: {
        streetAddress: unitCompData.address,
        city: unitCompData.city,
        state: unitCompData.state,
        postalCode: unitCompData.zip,
      },
      leaseDate: unitCompData.dateOfValue,
      unitNumber: unitCompData.unitNumber,
      numberOfBedrooms: unitCompData.bedrooms,
      propertyAndVersionReference: { propertyId: 'none', versionNumber: 0 }, // TODO: Remove this
      leaseInformation: {
        monthlyRent: unitCompData.rent,
        rentType: 'marketRate', // TODO: confirm
      },
      createdBy: 'justin.walters@boweryvaluation.com', // TODO: get user from AuthService
      propertyInformation: {},
      resourceInformation: {},
      verificationInformation: {},
    }

    const body = {
      query: `mutation upsertResidentialLeaseByAddress($input: CreateResidentialLeaseInput!) {
          upsertResidentialLeaseByAddress(input: $input) {
            id
          }
        }`,
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
}

export default CompPlexService
