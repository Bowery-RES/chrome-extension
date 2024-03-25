export const UNIT_AMENITIES_LIST = [
  { label: 'Laundry - In Unit', value: 'unitLaundry' },
  { label: 'Laundry - Building', value: 'buildingLaundry' },
  { label: 'Terrace', value: 'terrace' },
  { label: 'Backyard', value: 'backyard' },
]

export const UNIT_TYPES_LIST = [
  'Duplex',
  'Triplex',
  'Simplex',
  'Penthouse',
  'Loft',
  'Garden Style',
  'Basement',
  'Garage',
]

export const STREET_EASY_AMENITIES_MAP = {
  washer_dryer: 'unitLaundry',
  laundry: 'buildingLaundry',
  terrace: 'terrace',
  backyard: 'backyard',
}

export const ZILLOW_AMENITIES_MAP = {
  'In Unit': 'unitLaundry',
  'In Building': 'buildingLaundry',
}

export const COMPASS_AMENITIES_MAP = {
  'Private Laundry': 'unitLaundry',
  'Laundry in Building': 'buildingLaundry',
  'Private Terrace': 'terrace',
  'Back Yard': 'backyard',
}

export const GEOGRAPHY_OPTIONS = {
  NY: 'New York',
  NJ: 'New Jersey',
  OTHER: 'Other',
}

export const GOOGLE_ADDRESS_BOROUGH = {
  Manhattan: 'Manhattan',
  Brooklyn: 'Brooklyn',
  'The Bronx': 'Bronx',
  Queens: 'Queens',
  'Staten Island': 'Staten Island',
}

export const EVENTS = {
  INITIALIZE: 'INITIALIZE',
  EXTENSION_OPEN: 'EXTENSION_OPEN',
  EXTENSION_CLOSE: 'EXTENSION_CLOSE',
  COMP_PARSED: 'COMP_PARSED',
  COMP_PARSE_FAILED: 'COMP_PARSE_FAILED',
  COMP_ADDED: 'COMP_ADDED',
  LAST_REPORT_INITIALIZE: 'LAST_REPORT_INITIALIZE',
}

export const WIDGET_ID = 'bowery-extension'

export const ALLOWED_URLS = new RegExp(
  [
    'https://streeteasy.com/building/',
    'https://streeteasy.com/rental/',
    'https://www.zillow.com/homedetails/',
    'https://www.westsiderentals.com/',
    'https://www.compass.com/',
  ].join('|')
)

export const SOURCES_MAP = {
  'www.zillow.com': 'Zillow',
  'streeteasy.com': 'StreetEasy',
  'www.westsiderentals.com': 'WestsideRentals',
  'www.compass.com': 'Compass',
}

export const LOGO_MAP = {
  development: 'logo_development.png',
  production: 'logo_production.png',
}
