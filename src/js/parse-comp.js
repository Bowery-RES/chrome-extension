import get from 'lodash/get'
import includes from 'lodash/includes'

const BUILDING_AMENITIES = {
    bike_room: 'Bike Room',
    elevator: 'Elevator',
    parking: 'Parking',
    virtual_doorman: 'Virtual Doorman',
    full_time_doorman: 'Full-time Doorman',
    laundry: 'Laundry Room',
    storage_room: 'Storage Units',
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
    const amenities = Object.entries(amenitiesMap).filter(([key, value]) => includes(amenitiesList, key)).map(([key, value]) => value)

    return amenities
};

(function parseComp() {
    const [, data = "[]"] = document.body.textContent.match(/dataLayer = (\[.*\]);/) || []
    const [compData] = JSON.parse(data)

    const amenities = compData.listAmen.split('|')
    const result = {
        sourceOfInformation: 'externalDatabase',
        sourceUrl: document.location.toString(),
        sourceName: 'Streeteasy',
        rooms: get(compData, 'listRoom'),
        bedrooms: get(compData, 'listBed'),
        bathrooms: get(compData, 'listBath'),
        zip: get(compData, 'listZip'),
        sqft: get(compData, 'listSqFt'),
        city: get(compData, 'listBoro'),
        buildingAmenities: getListsOfAmenities(amenities, BUILDING_AMENITIES),
        unitAmenities: getListsOfAmenities(amenities, UNIT_AMENITIES),
    }

    chrome.extension.sendRequest({ type: 'parsed-data', data: result });
})()