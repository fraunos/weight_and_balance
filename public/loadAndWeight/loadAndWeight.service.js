import { AWUtilsService } from "../core/utils/utils.service.js";


export class AWLoadAndWeightService {
    awUtilsSvc = new AWUtilsService();
    constructor() { };

    getLoadWeight(density, value) {
        return this.awUtilsSvc.round(density * value);
    }

    getLoadMoment(load) {
        return this.awUtilsSvc.round(load.moment || this.getLoadWeight(load) * load.arm);
    }

    getSumLoad(loads, fn) {
        const sum = loads?.map(fn)
            .filter(i => i)
            .reduce((acc, cv) => {
                return cv + acc
            }, 0);
        return this.awUtilsSvc.round(sum);
    }

    getCogArm(totalMoment, totalWeight) {
        return this.awUtilsSvc.round(totalMoment / totalWeight);
    }
}