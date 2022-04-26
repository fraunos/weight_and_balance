export class AWPlanesService {
    constructor() { };

    async listPlanes() {
        return await this.requestJSON('/planes');
    }

    async detailsPlane(jsonFile) {
        return await this.requestJSON(`/planesData/${jsonFile}`);
    }

    async requestJSON(url) {
        const res = await fetch(url);
        const data = await res.json();
        return data
    }
}