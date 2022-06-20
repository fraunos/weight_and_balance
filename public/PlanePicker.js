export default {
  data() {
    return {
      selectedPlane: "SP-TIR.json",
      planesList: [],
    }
  },
  async mounted() {
    this.getPlaneData()
    this.planesList = await requestJSON('/planes')
  },
  methods: {
    async getPlaneData() {
      const planeData = await requestJSON(`/planesData/${this.selectedPlane}`)
      planeData.loads.map(i => i.min ? i.value = i.min : false)
      console.log(planeData)
      this.$emit('choosePlane', planeData)
    },
  },
  template: vue`
      <div>
        <label for="planes">Samolot:</label>
        <select @change="getPlaneData($event)" v-model="selectedPlane" name="planes" id="planes" autocomplete="off">
          <option disabled selected value>wybierz</option>
          <option v-for="plane in planesList" :value="plane">{{plane.replace(/\.json/,'')}}</option>
        </select>
      </div>
  `
}

function vue(str, exp) {
  return str.raw[0]
}

async function requestJSON(url) {
  const res = await fetch(url)
  const data = await res.json()
  return data
}
