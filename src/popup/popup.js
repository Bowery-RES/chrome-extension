import { EVENTS } from '../app/lib/constants';

chrome.runtime.sendMessage({ type: EVENTS.EXTENSION_OPEN });
window.close();

