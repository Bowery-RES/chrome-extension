import StreetEasyParser from './StreetEasyParser'
import ZillowParser from './ZillowParser'

export default (document) => {
  switch (document.location.hostname) {
    case 'www.zillow.com':
      return new ZillowParser({ document })
    case 'streeteasy.com':
      return new StreetEasyParser({ document })
    default:
      return {}
  }
}
