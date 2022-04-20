import Chart from '/Chart.js'

export default {
  components: [
    Chart
  ],
  data() {
    return {
      selectedPlane: "SP-RAM.json",
      planesList: [],
      planeData: false,
      currentDate: new Date()
    }
  },
  async mounted() {
    this.getPlaneData()
    this.planesList = await requestJSON('/planes')
    setInterval(() => {
      this.currentDate = new Date()
    }, 1000 * 60)
  },
  methods: {
    async getPlaneData() {
      this.planeData = false
      this.planeData = await requestJSON(`/planesData/${this.selectedPlane}`)
    },
    loadWeight({ density = 1, value }) {
      return round(density * value)
    },
    loadMoment(load) {
      return round(load.moment || this.loadWeight(load) * load.arm)
    },
    sumLoad(loads, fn) {
      const sum = loads?.map(fn)
        .filter(i => i)
        .reduce((acc, cv) => {
          return cv + acc
        }, 0)
      return round(sum)
    },
    totalWeight(loads) {
      return this.sumLoad(loads, this.loadWeight)
    },
    totalMoment(loads) {
      return this.sumLoad(loads, this.loadMoment)
    },
    cogArm(loads) {
      return round(this.totalMoment(loads) / this.totalWeight(loads))
    },
    isWeightCorrect(planeData) {
      const { totalWeight } = this
      return totalWeight(planeData.loads) > planeData.minWeight &&
        totalWeight(planeData.loads) < planeData.maxWeight
    },
    isBalanceCorrect(planeData) {
      const { cogArm } = this
      return cogArm(planeData.loads) > planeData.minCogArm &&
        cogArm(planeData.loads) < planeData.maxCogArm
    },
  },
  computed: {
    fuelUsage() {
      if (!this.planeData.loads) return []
      let x = []
      const fuelLoads = this.planeData.loads.filter(i => i.name.includes('fuel')).map(i=>i.name)
      const clonedLoads = JSON.parse(JSON.stringify(this.planeData.loads))

      for (const fuelName of fuelLoads) {
        clonedLoads.find(i=>i.name===fuelName).value = 0
      }

      x.push(JSON.parse(JSON.stringify(clonedLoads)))
      for (const fuelName of fuelLoads) {
        const load = clonedLoads.find(i=>i.name === fuelName)
        load.value = load.max
        x.push(JSON.parse(JSON.stringify(clonedLoads)))
      }

      return x.map(i=>{
        return {
          totalWeight: this.totalWeight(i),
          cogArm: this.cogArm(i)
        }
      })
    }
  }

}

async function requestJSON(url) {
  const res = await fetch(url)
  const data = await res.json()
  return data
}

function round(number) {
  return Math.round(number * 1000) / 1000
}