import 'chrome-extension-async';
import axios from 'axios';
import get from 'lodash/get';
import 'chrome-extension-async';
import { BOWERY_APP_DOMAIN } from 'secrets';

class AuthService {
  static async authenticate({ obtainFreshToken = false } = {}) {
    try {
      const { token } = obtainFreshToken
        ? await AuthService._obtainToken()
        : await chrome.storage.local.get('token');
      const response = await axios.get(`${BOWERY_APP_DOMAIN}/user/authenticated-user`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });

      const user = AuthService._mapUser(response.data)
      return { user };
    } catch (error) {
      if (!obtainFreshToken) {
        return await AuthService.authenticate({ obtainFreshToken: true });
      } else {
        throw error;
      }
    }
  }

  static async _obtainToken() {
    const tab = await chrome.tabs.create({ url: BOWERY_APP_DOMAIN, active: false });
    const [jwToken] = await chrome.tabs.executeScript(tab.id, { code: "localStorage.getItem('jwToken')" });
    await chrome.tabs.remove(tab.id);
    await chrome.storage.local.set({ token: jwToken });
    return { token: jwToken };
  }

  static _mapUser(data) {
    const user = {
      id: get(data, 'id'),
      name: get(data, 'fullName'),
      first_name: get(data, 'name.first'),
      last_name: get(data, 'name.last'),
      position: get(data, 'position'),
      email: get(data, 'username'),
    };
    return user
  }
}

export default AuthService;
