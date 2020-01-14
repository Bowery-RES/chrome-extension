import App from '../app/svelte/App.svelte';
import { EVENTS, WIDGET_ID } from '../app/lib/constants';

!document.getElementById(WIDGET_ID) && injectExtension();

function injectExtension() {
    const container = document.createElement('aside');
    container.id = WIDGET_ID;
    document.body.appendChild(container);
    document.addEventListener('click', function(event) {
        const container = document.getElementById(WIDGET_ID);
        if (!container.contains(event.target)) {
            chrome.runtime.sendMessage({ type: EVENTS.EXTENSION_CLOSE });
            container.remove();
        }
    });

    const app = new App({
        target: container,
    });

    window.app = app;
}
