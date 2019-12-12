export const UNIT_AMENITIES_LIST = [
    {
        label: 'Laundry - In Unit',
        value: 'unitLaundry',
    },
    {
        label: 'Laundry - Building',
        value: 'buildingLaundry',
    },
    {
        label: 'Terrace',
        value: 'terrace',
    },
    {
        label: 'Backyard',
        value: 'backyard',
    },
];

export const STREET_EASY_AMENITIES_MAP = {
  washer_dryer: 'unitLaundry',
  laundry: 'buildingLaundry',
  terrace: 'terrace',
  backyard: 'backyard',
};

export const GOOGLE_API = 'https://maps.googleapis.com/maps/api/geocode/json'

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