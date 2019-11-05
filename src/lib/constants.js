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