import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty'
import startCase from 'lodash/startCase'
import intersection from 'lodash/intersection';
import words from 'lodash/words';
import $ from 'jquery';
import { UNIT_AMENITIES_LIST, STREET_EASY_AMENITIES_MAP } from '../constants';
import BoweryService from '../services/BoweryService'
import BaseParser from './BaseParser'

export default class StreetEasyParser extends BaseParser {
  constructor({ document }) {
    super({ document, source: 'StreetEasy' })

  }
  async getCompFromDocument() {
    const [, data = '[]'] = this.document.body.textContent.match(/dataLayer = (\[.*\]);/) || [];
    const [compData] = JSON.parse(data);

    const amenitiesList = get(compData, 'listAmen', '').split('|');
    const buildingTitle = $('.building-title .incognito').text();
    const [, , , unitNumber] = buildingTitle.match(/(.*) (#|UNIT-)(.*)/) || [];
    const dateOfValue = $('.DetailsPage-priceHistory .Table tr:first-child .Table-cell--priceHistoryDate .Text')
      .text()
      .trim();
    const description = $(".Description-block").text().trim()
    const [unitLayout] = description.match(/(duplex|triplex|simplex|penthouse|loft|garden style|basement|garage)/) || []

    const zip = get(compData, 'listZip');
    const address = this.getTextContent('.backend_data.BuildingInfo-item');
    const location = await this.getLocationInfoFromAddress({ zip, address });
    const amenities = this.getListsOfAmenities(amenitiesList)

    const property = await BoweryService.getPropertyData({
      address: location.address,
      city: location.city,
      zip
    })
    const result = {
      state: location.state,
      dateOfValue: new Date(dateOfValue).toISOString(),
      coords: location.coords,
      city: location.city,
      unitLayout: startCase(unitLayout),
      unitNumber,
      address: location.address,
      locationIdentifier: location.locationIdentifier,
      zip,
      borough: property.borough,
      block: property.block,
      lot: property.lot,
      rooms: get(compData, 'listRoom'),
      bedrooms: get(compData, 'listBed'),
      bathrooms: get(compData, 'listBath'),
      sqft: get(compData, 'listSqFt', '') || 0,
      rent: get(compData, 'listPrice', ''),
      amenities: isEmpty(amenities) ? null : amenities,
      sourceOfInformation: 'externalDatabase',
      sourceUrl: this.document.location.toString(),
      sourceName: 'StreetEasy',
    };

    return result;
  }

  getTextContent(selector) {
    const text = $(selector).text();
    return words(text).join(' ');
  };

  getListsOfAmenities(amenitiesList) {
    const unitAmenities = intersection(Object.keys(STREET_EASY_AMENITIES_MAP), amenitiesList);
    return unitAmenities.map(amenity =>
      UNIT_AMENITIES_LIST.find(pair => pair.value === STREET_EASY_AMENITIES_MAP[amenity]),
    );
  };
}