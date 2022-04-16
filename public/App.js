import Chart from '/Chart.js'

export default {
  components: [
    Chart
  ],
  data() {
    return {
      selectedPlane: "",
      planesList: [],
      planeData: {}
    }
  },
  async mounted() {
    this.planesList = await requestJSON('/planes')
  },
  methods: {
    async getPlaneData(ev) {
      console.log(ev)
      this.planeData = await requestJSON(ev.target.value)
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
    }
  }

}

async function requestJSON(url) {
  const res = await fetch(url)
  const data = await res.json()
  return data
}

function round(number){
  return Math.round(number * 100) / 100
}