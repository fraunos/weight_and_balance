import Chart from '/Chart.js'

export default {
  components: [
    Chart
  ],
  data() {
    return {
      selectedPlane: "SP-TPF.json",
      planesList: [],
      planeData: false
    }
  },
  async mounted() {
    this.getPlaneData()
    this.planesList = await requestJSON('/planes')
  },
  methods: {
    async getPlaneData() {
      this.planeData = await requestJSON(`/planesData/${this.selectedPlane}`)
    },
    loadWeight({ density = 1, value }) {
      return round(density * value)
    },
    loadMoment(load) {
      return round(load.moment || this.loadWeight(load) * load.arm)
    },
    sumLoad(fn) {
      const sum = this.planeData.loads?.map(fn)
        .filter(i => i)
        .reduce((acc, cv) => {
          return cv + acc
        }, 0)
      return round(sum)
    }
  },
  computed: {
    totalWeight() {
      return this.sumLoad(this.loadWeight)
    },
    totalMoment() {
      return this.sumLoad(this.loadMoment)
    },
    cogArm() {
      return round(this.totalMoment / this.totalWeight)
    }
  }

}

async function requestJSON(url) {
  const res = await fetch(url)
  const data = await res.json()
  return data
}

function round(number){
  return Math.round(number * 1000) / 1000
}