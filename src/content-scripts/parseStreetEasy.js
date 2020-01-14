import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty'
import intersection from 'lodash/intersection';
import words from 'lodash/words';
import { geocodeByAddress } from '../app/lib/api';
import $ from 'jquery';
import { UNIT_AMENITIES_LIST, STREET_EASY_AMENITIES_MAP, GEOGRAPHY_OPTIONS, GOOGLE_ADDRESS_BOROUGH, EVENTS } from '../app/lib/constants';

const getListsOfAmenities = amenitiesList => {
  const unitAmenities = intersection(Object.keys(STREET_EASY_AMENITIES_MAP), amenitiesList);
  return unitAmenities.map(amenity =>
    UNIT_AMENITIES_LIST.find(pair => pair.value === STREET_EASY_AMENITIES_MAP[amenity]),
  );
};

const getLocationInfoFromAddress = async ({ address, zip }) => {
  const addressInfo = await geocodeByAddress({ address, zip });
  const location = {};

  const addressComponents = get(addressInfo, 'address_components') || [];
  for (const part of addressComponents) {
    part.types.forEach(type => {
      location[type] = { short: part.short_name, long: part.long_name };
    });
  }
  let borough = {}

  const state = get(location, 'administrative_area_level_1.short');
  let city = location.locality || addressInfo.sublocality || addressInfo.neighborhood;

  if (state === 'NJ') {
    city = get(location, 'administrative_area_level_3') || get(location, 'locality');
  } else if (state === 'NY') {
    city = location.sublocality || location.locality || {};
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
  };

  return {
    address: `${get(location, 'street_number.long')} ${get(location, 'route.long')}`,
    city: city ? city.short : '',
    zip: location.postal_code ? location.postal_code.short : '',
    state,
    locationIdentifier,
    coords,
  };
};

const getTextContent = selector => {
  const text = $(selector).text();
  return words(text).join(' ');
};

(async function parseComp() {
  const [, data = '[]'] = document.body.textContent.match(/dataLayer = (\[.*\]);/) || [];
  const [compData] = JSON.parse(data);

  const amenitiesList = get(compData, 'listAmen', '').split('|');
  const buildingTitle = $('.building-title .incognito').text();
  const [, , unitNumber] = buildingTitle.match(/(.*) #(.*)/);
  const dateOfValue = $('.DetailsPage-priceHistory .Table tr:first-child .Table-cell--priceHistoryDate .Text')
    .text()
    .trim();
  const zip = get(compData, 'listZip');
  const address = getTextContent('.backend_data.BuildingInfo-item');
  const location = await getLocationInfoFromAddress({ zip, address });
  const amenities = getListsOfAmenities(amenitiesList)
  const result = {
    state: location.state,
    dateOfValue: new Date(dateOfValue).toISOString(),
    coords: location.coords,
    city: location.city,
    unitNumber,
    address: location.address,
    locationIdentifier: location.locationIdentifier,
    zip,
    rooms: get(compData, 'listRoom'),
    bedrooms: get(compData, 'listBed'),
    bathrooms: get(compData, 'listBath'),
    sqft: get(compData, 'listSqFt', ''),
    rent: get(compData, 'listPrice', ''),
    amenities: isEmpty(amenities) ? null : amenities,
    sourceOfInformation: 'externalDatabase',
    sourceUrl: document.location.toString(),
    sourceName: 'StreetEasy',
  };
  chrome.runtime.sendMessage({ type: EVENTS.COMP_PARSED, data: result });
})()