export class AWUtilsService {
    constructor(){};

    round(number) {
        return Math.round(number * 1000) / 1000
    }

    filter(targetArray, fn) {
        let result = [];
        targetArray.forEach(element => {
            if(fn(element)) {
                result.push(element);
            }
        });
        return result;
    }
}