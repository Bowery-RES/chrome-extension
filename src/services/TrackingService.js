import Amplitude from 'amplitude-js';
import { AMPLITUDE_API_KEY } from 'secrets'

class TrackingService {
  constructor() {
    this.client = Amplitude.getInstance();
    this.client.init(AMPLITUDE_API_KEY);
  }

  identify(user) {
    this.client.setUserId(user.id)
    const identify = new Amplitude.Identify()
      .set('name', user.name)
      .set('first_name', user.first_name)
      .set('last_name', user.last_name)
      .set('email', user.email)
      .set('position', user.position);

    this.client.identify(identify);
  }

  logEvent(name, properties = {}) {
    this.client.logEvent(name, { ...properties, version: process.env.VERSION });
  }
}

export default new TrackingService()
