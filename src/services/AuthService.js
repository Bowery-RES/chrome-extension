import get from 'lodash/get'
import { BOWERY_APP_DOMAIN } from 'secrets'
import BoweryService from './BoweryService'
import ChromeService from './ChromeService'

class AuthService {
  static async authenticate({ obtainFreshToken = false } = {}) {
    try {
      const token = obtainFreshToken ? await AuthService.obtainToken() : await ChromeService.getToken()
      const response = await BoweryService.getAuthenticatedUser({ token })

      const user = AuthService.mapUser(response.data)
      return { user }
    } catch (error) {
      if (!obtainFreshToken) {
        const user = await AuthService.authenticate({ obtainFreshToken: true })
        return user
      }
      throw error
    }
  }

  static async obtainToken() {
    const jwToken = await ChromeService.runScriptInNewTab({
      url: BOWERY_APP_DOMAIN,
      script: "localStorage.getItem('jwToken')",
    })
    await ChromeService.setToken(jwToken)
    return jwToken
  }

  static mapUser(data) {
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
