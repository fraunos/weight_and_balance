import { AWPlanesService } from "./core/services/planes.service.js";


const awPlanesService = new AWPlanesService();
export default {
  components: {},
  data() {
    return {
      selectedPlane: 'SP-RAM.json',
      planesList: []
    }
  },
  async mounted() {
    this.planesList = await awPlanesService.listPlanes();
  },
  methods: {
    onSelectedChange: function (event) {
      console.log(event);
      this.selectedPlane = event.value;
    }
  },
  computed: {}
}