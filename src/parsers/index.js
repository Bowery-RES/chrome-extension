import StreetEasyParser from './StreetEasyParser'
import ZillowParser from './ZillowParser'
import WRParser from './WestsideRentals'

export default (document) => {
  switch (document.location.hostname) {
    case 'www.zillow.com':
      return new ZillowParser({ document })
    case 'streeteasy.com':
      return new StreetEasyParser({ document })
    case 'www.westsiderentals.com':
      return new WRParser({ document })
    default:
      return {}
  }
}
