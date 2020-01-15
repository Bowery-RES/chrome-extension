import App from '../app/svelte/App.svelte';
import { EVENTS, WIDGET_ID } from '../app/lib/constants';

!document.getElementById(WIDGET_ID) && injectExtension();

function injectExtension() {
  const container = document.createElement('aside');
  container.id = WIDGET_ID;
  document.body.appendChild(container);
  var style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.href = chrome.extension.getURL('widget.css');
  var fonts = document.createElement('link');
  fonts.rel = 'stylesheet';
  fonts.type = 'text/css';
  fonts.href = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700';

  (document.head || document.documentElement).appendChild(style);
  (document.head || document.documentElement).appendChild(fonts);

  document.addEventListener('click', function (event) {
    const container = document.getElementById(WIDGET_ID);
    if (container && !container.contains(event.target)) {
      chrome.runtime.sendMessage({ type: EVENTS.EXTENSION_CLOSE });
      container.remove();
    }
  });

  const app = new App({
    target: container,
  });

  window.app = app;
}
