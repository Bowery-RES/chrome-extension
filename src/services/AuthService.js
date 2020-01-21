import get from 'lodash/get'
import { BOWERY_APP_DOMAIN } from 'secrets'
import BoweryService from './BoweryService'
import ChromeService from './ChromeService'

class AuthService {
  static async authenticate({ obtainFreshToken = false } = {}) {
    try {
      const token = obtainFreshToken
        ? await AuthService._obtainToken()
        : await ChromeService.getToken()
      const response = await BoweryService.getAuthenticatedUser({ token })
      
      const user = AuthService._mapUser(response.data)
      return { user }
    } catch (error) {
      if (!obtainFreshToken) {
        return await AuthService.authenticate({ obtainFreshToken: true })
      } else {
        throw error
      }
    }
  }

  static async _obtainToken() {
    const jwToken = await ChromeService.runScriptInNewTab({ url: BOWERY_APP_DOMAIN, script: "localStorage.getItem('jwToken')" })
    await ChromeService.setToken(jwToken)
    return jwToken
  }

  static _mapUser(data) {
    const user = {
      id: get(data, 'id'),
      name: get(data, 'fullName'),
      first_name: get(data, 'name.first'),
      last_name: get(data, 'name.last'),
      position: get(data, 'position'),
      email: get(data, 'username'),
    }
    return user
  }
}

export default AuthService
