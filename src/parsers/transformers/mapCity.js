import mapCity from './mapCity.json'

export default ({ city, ...rest } = {}, map = mapCity) => {
  if (mapCity[city] === undefined) {
    return { city, ...rest }
  }
  return { ...rest, city: map[city] }
}
