import { EVENTS } from '../constants'
import ChromeService from '../services/ChromeService'

ChromeService.emit({ type: EVENTS.EXTENSION_OPEN })
window.close()
