import App from '../app/App.svelte';
import '../assets/font.css'
import { WIDGET_ID } from '../constants';

function injectExtension() {
  const container = document.createElement('aside');
  container.id = WIDGET_ID;
  document.body.appendChild(container);

  const app = new App({
    target: container,
  });

  window.app = app;
}

!document.getElementById(WIDGET_ID) && injectExtension();
