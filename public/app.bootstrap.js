import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import App from '/root.component.js';
import Chart from '/chart/chart.component.js';
import LoadAndWeight from '/loadAndWeight/loadAndWeight.component.js';
import awHeader from '/awHeader/awHeader.component.js';
import awPlaneDetails from '/planeDetails/planeDetails.component.js';

(() => {
    const app = createApp(App);
    app.component('Chart', Chart)
        .component('load-and-weight', LoadAndWeight)
        .component('aw-header', awHeader)
        .component('aw-plane-details', awPlaneDetails)
    const mountedApp = app.mount('#app');
})();