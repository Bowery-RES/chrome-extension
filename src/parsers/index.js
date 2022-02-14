import StreetEasyParser from './StreetEasyParser'
import ZillowParser from './ZillowParser'
import WRParser from './WestsideRentals'
import CompassParser from './CompassParser'

export default (document) => {
  switch (document.location.hostname) {
    case 'www.zillow.com':
      return new ZillowParser({ document })
    case 'streeteasy.com':
      return new StreetEasyParser({ document })
    case 'www.westsiderentals.com':
      return new WRParser({ document })
    case 'www.compass.com':
      return new CompassParser({ document })
    default:
      return {}
  }
}
