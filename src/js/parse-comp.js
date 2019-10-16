import get from 'lodash/get'
import includes from 'lodash/includes'
import findLastIndex from 'lodash/findLastIndex'
import lowerCase from 'lodash/lowerCase'
import $ from 'jquery'

const ROAD_TYPES = [
  'st',
  'str',
  'av',
  'ave',
  'pl',
  'blvd',
  'pkwy',
  'rd',
  'cir',
  'ct',
  'dr',
  'hwy',
  'fwy',
  'jct',
  'ln',
  'ter',
  'tpk',
]


export const STATE_NAMES_SHORT = {
  NY: 'NY',
  AL: 'AL',
  AK: 'AK',
  AZ: 'AZ',
  AR: 'AR',
  CA: 'CA',
  CO: 'CO',
  CT: 'CT',
  DE: 'DE',
  DC: 'DC',
  FL: 'FL',
  GA: 'GA',
  HI: 'HI',
  ID: 'ID',
  IL: 'IL',
  IN: 'IN',
  IA: 'IA',
  KS: 'KS',
  KY: 'KY',
  LA: 'LA',
  ME: 'ME',
  MD: 'MD',
  MA: 'MA',
  MI: 'MI',
  MN: 'MN',
  MS: 'MS',
  MO: 'MO',
  MT: 'MT',
  NE: 'NE',
  NV: 'NV',
  NH: 'NH',
  NJ: 'NJ',
  NM: 'NM',
  NC: 'NC',
  ND: 'ND',
  OH: 'OH',
  OK: 'OK',
  OR: 'OR',
  PA: 'PA',
  PR: 'PR',
  RI: 'RI',
  SC: 'SC',
  SD: 'SD',
  TN: 'TN',
  TX: 'TX',
  UT: 'UT',
  VT: 'VT',
  VA: 'VA',
  WA: 'WA',
  WV: 'WV',
  WI: 'WI',
  WY: 'WY',
}

export const STATE_NAMES = {
  NY: 'New York',
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District Of Columbia',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
}
 const GOOGLE_ADDRESS_BOROUGH = {
  Manhattan: 'Manhattan',
  Brooklyn: 'Brooklyn',
  'The Bronx': 'Bronx',
  Queens: 'Queens',
  'Staten Island': 'Staten Island',
}

const BUILDING_AMENITIES = {
  bike_room: 'Bike Room',
  elevator: 'Elevator',
  parking: 'Parking',
  virtual_doorman: 'Virtual Doorman',
  full_time_doorman: 'Full-time Doorman',
  laundry: 'Laundry Room',
  storage: 'Storage Units',
  gym: 'Fitness Center',
  live_in_super: 'Live-in Super',
  garden: 'Garden',
  roofdeck: 'Roof Deck',
  deck: 'Deck',
  pool: 'Swimming Pool'
}

const UNIT_AMENITIES = {
  dishwasher: 'Dishwasher',
  washer_dryer: 'Washer/Dryer In-Units',
  central_ac: 'Central Air Conditioning'
};

const getListsOfAmenities = (amenitiesList, amenitiesMap) => {
  const amenities = Object.entries(amenitiesMap)
    .filter(([key]) => includes(amenitiesList, key)).map(([, value]) => value)

  return amenities
};

const formatStreetAddress = streetName => {
  const streetParts = streetName.split(' ')
  const streetTypeIndex = findLastIndex(streetParts, part => ROAD_TYPES.includes(lowerCase(part)))
  if (streetTypeIndex !== -1) {
    streetParts[streetTypeIndex] = `${streetParts[streetTypeIndex]}.`
  }
  return streetParts.join(' ')
}

export const getLocationInfoFromAddress = addressInfo => {
  const location = {}

  const addressComponents = get(addressInfo, 'address_components') || []
  for (const part of addressComponents) {
    part.types.forEach(type => {
      location[type] = { short: part.short_name, long: part.long_name }
    })
  }
  let address = get(addressInfo, 'formatted_address')
  const state = get(location, 'administrative_area_level_1.short')
  const county = get(location, 'administrative_area_level_2.short')
  let borough = {}
  const streetNumber = get(location, 'street_number.short')
  let city = location.locality || addressInfo.sublocality || addressInfo.neighborhood
  const route = get(location, 'route', {})
  const streetName = formatStreetAddress(route.short)
  const country = get(location.country, 'short', '')

  if (state === STATE_NAMES_SHORT.NJ) {
    city = get(location, 'administrative_area_level_3') || get(location, 'locality')
  } else if (state === STATE_NAMES_SHORT.NY) {
    city = location.sublocality || location.locality || {}
    borough = {
      short: GOOGLE_ADDRESS_BOROUGH[city.short],
      long: GOOGLE_ADDRESS_BOROUGH[city.long],
    }
    // New York does a pluto lookup without the zip code, therefore, we pass address to it that was used to search by
    address = addressInfo.googlePlace
  }

  return {
    address,
    streetNumber,
    streetName,
    route,
    shortAddress: `${streetNumber} ${streetName}`,
    city: city ? city.short : '',
    borough,
    county,
    zip: location.postal_code ? location.postal_code.short : '',
    state,
    country,
  }
}

(async function parseComp() {
  const [, data = "[]"] = document.body.textContent.match(/dataLayer = (\[.*\]);/) || []
  const [compData] = JSON.parse(data)

  const amenities = compData.listAmen.split('|')
  const buildingTitle = $('.building-title .incognito').text()
  const [, , unitNumber] = buildingTitle.match(/(.*) #(.*)/)
  const dateOfValue = $('.DetailsPage-priceHistory .Table tr:first-child .Table-cell--priceHistoryDate .Text').text().trim()
  const zip =  get(compData, 'listZip');
  const address = $('.backend_data.BuildingInfo-item').text()
  //const addressInfo = await $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address},${zip}&key=${process.env.GOOGLE_API_KEY}`)
  //console.log(getLocationInfoFromAddress(addressInfo.results[0]))
  const result = {
    state: '',
    dateOfValue,
    coords: {},
    city: get(compData, 'listBoro'),
    unitNumber,
    address,
    zip,
    sourceOfInformation: 'externalDatabase',
    sourceUrl: document.location.toString(),
    sourceName: 'Streeteasy',

    rooms: get(compData, 'listRoom'),
    bedrooms: get(compData, 'listBed'),
    bathrooms: get(compData, 'listBath'),
    sqft: get(compData, 'listSqFt'),
    rent: get(compData, 'listPrice'),
    buildingAmenities: getListsOfAmenities(amenities, BUILDING_AMENITIES),
    unitAmenities: getListsOfAmenities(amenities, UNIT_AMENITIES),
  }

  chrome.extension.sendRequest({ type: 'comp-parsed', data: result });
})()