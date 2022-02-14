import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import intersection from 'lodash/intersection'
import { getUnitLayout } from '../helpers'
import { SOURCES_MAP, UNIT_AMENITIES_LIST, COMPASS_AMENITIES_MAP } from '../constants'

export default class CompassParser {
  constructor({ document }) {
    this.document = document
    this.source = SOURCES_MAP[this.document.location.hostname]
  }

  get location() {
    const prettyAddress = get(this.compData, 'props.listingRelation.listing.location.prettyAddress', '')
    const locations = prettyAddress.split(/,\s+/)

    if (locations.length < 2) {
      return locations
    }

    const unitNumber = locations.pop()
    const address = locations.join(', ')
    return [address, unitNumber]
  }

  get unitLayout() {
    const description = get(this.compData, 'props.listingRelation.listing.description', '')
    return getUnitLayout(description)
  }

  get dateOfValue() {
    const dateOfValueRecent = get(this.compData, 'props.listingRelation.listing.history[0].timestamp', null)
    return dateOfValueRecent ? new Date(dateOfValueRecent).toISOString() : null
  }

  get amenities() {
    const amenitiesList = get(this.compData, 'props.listingRelation.listing.detailedInfo.amenities', [])
    const unitAmenities = intersection(Object.keys(COMPASS_AMENITIES_MAP), amenitiesList)

    return unitAmenities.map((amenity) =>
      UNIT_AMENITIES_LIST.find((pair) => pair.value === COMPASS_AMENITIES_MAP[amenity])
    )
  }

  get hasElevator() {
    const amenitiesList = get(this.compData, 'props.listingRelation.listing.detailedInfo.amenities', [])
    return amenitiesList.some((amenity) => amenity === 'Elevator')
  }

  parse() {
    const [, data = '{}'] = this.document.body.textContent.match(/__PARTIAL_INITIAL_DATA__ = (\{.*\})/) || []
    this.compData = JSON.parse(data)

    const result = {
      rooms: get(this.compData, 'props.listingRelation.listing.size.totalRooms'),
      bedrooms: get(this.compData, 'props.listingRelation.listing.size.bedrooms', 0),
      sqft: get(this.compData, 'props.listingRelation.listing.size.squareFeet', 0),
      bathrooms: get(this.compData, 'props.listingRelation.listing.size.totalBathrooms', 0),
      rent: get(this.compData, 'props.listingRelation.listing.price.lastKnown', null),
      address: isEmpty(this.location[0]) ? null : this.location[0],
      unitNumber: isEmpty(this.location[1]) ? null : this.location[1],
      unitLayout: this.unitLayout,
      dateOfValue: this.dateOfValue,
      sourceOfInformation: 'externalDatabase',
      sourceUrl: this.document.location.toString(),
      sourceName: this.source,
      zip: get(this.compData, 'props.listingRelation.listing.location.zipCode'),
      city: get(this.compData, 'props.listingRelation.listing.location.neighborhood'),
      state: get(this.compData, 'props.listingRelation.listing.location.state'),
      amenities: isEmpty(this.amenities) ? null : this.amenities,
      internalNotes: this.hasElevator ? 'Building has an elevator' : '',
    }
    return result
  }
}
