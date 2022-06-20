export default {
  data() {
    return {
      planeData: false,
      currentDate: new Date()
    }
  },
  async mounted() {
    setInterval(() => {
      this.currentDate = new Date()
    }, 1000 * 60)
  },
  methods: {
    round(number = 0) {
      const { precision = 1000 } = this.planeData
      return Math.round(number * precision) / precision
    },
    loadWeight({ density = 1, value }) {
      return density * value
    },
    loadMoment(load) {
      return load.moment || this.loadWeight(load) * load.arm
    },
    sumLoad(loads, fn) {
      const sum = loads?.map(fn)
        .filter(i => i)
        .reduce((acc, cv) => {
          return cv + acc
        }, 0)
      return sum
    },
    totalWeight(loads) {
      return this.sumLoad(loads, this.loadWeight)
    },
    totalMoment(loads) {
      return this.sumLoad(loads, this.loadMoment)
    },
    cogArm(loads) {
      return this.totalMoment(loads) / this.totalWeight(loads)
    },
    isWeightCorrect() {
      const { loads, minWeight, maxWeight } = this.planeData
      return this.totalWeight(loads) > minWeight &&
        this.totalWeight(loads) < maxWeight
    },
    isBalanceCorrect() {
      const { loads, minCogArm, maxCogArm } = this.planeData
      return this.cogArm(loads) > minCogArm &&
        this.cogArm(loads) < maxCogArm
    },
    unitConversionsToSI(unit) {
      switch (unit) {
        case 'usgal':
          return {
            unit: 'liter',
            ratio: 3.785412
          }
        case 'lbs':
          return {
            unit: 'kg',
            ratio: 0.45359237
          }
      }
    },
  },
  computed: {
    displayConversion() {
      return this.planeData.units === 'imperial'
    },
    fuelUsage() {
      if (!this.planeData.loads) return []
      let x = []
      const fuelLoads = this.planeData.loads.filter(i => i.name.includes('fuel')).map(i => i.name)
      const clonedLoads = JSON.parse(JSON.stringify(this.planeData.loads))

      for (const fuelName of fuelLoads) {
        clonedLoads.find(i => i.name === fuelName).value = 0
      }

      x.push(JSON.parse(JSON.stringify(clonedLoads)))

      const precision = 5
      for (const fuelName of fuelLoads) {
        const load = clonedLoads.find(fl => fl.name === fuelName)
        for (let i = 0; i < precision; i++) {
          load.value = (i + 1) / precision * load.max
          x.push(JSON.parse(JSON.stringify(clonedLoads)))
        }
      }

      return x.map(i => {
        return {
          totalWeight: this.totalWeight(i),
          cogArm: this.cogArm(i)
        }
      })
    }
  }

}


