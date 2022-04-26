import { AWPlanesService } from "../core/services/planes.service.js";
import { AWUtilsService } from "../core/utils/utils.service.js";

const awPlanesService = new AWPlanesService();
const awUtilsSvc = new AWUtilsService();
export default {
    components: [],
    props: ['selected'],
    data() {
        return {
            planeDetails: {},
            keys: []
        };
    },
    async mounted() {
        this.planeDetails = await this.getPlaneData();
        this.keys = await this.getKeys();
    },
    methods: {
        getPlaneData () {
            return awPlanesService.detailsPlane(this.selected);
        },
        async getKeys () {
            const details = await this.planeDetails;
            const keys = Object.keys(details);
            const allowedKeys = ['callsign', 'type', 'minWeight', 'maxWeight', 'minCogArm', 'maxCogArm', 'lastUpdated'];
            const filteredKeys = awUtilsSvc.filter(keys, (item) => {
                return allowedKeys.indexOf(item) >= 0;
            });
            return filteredKeys;
        }
    },
    watch: {
        selected: async function (oldSelected, newSelected) {
            this.planeDetails = await this.getPlaneData();
            console.log(this.planeDetails);
            this.keys = await this.getKeys();
            console.log(this.keys);
          }
    }
    ,
    model: {
    },
    computed: {
    },
    template: '#planeDetails'
  }