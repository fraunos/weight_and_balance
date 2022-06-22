export default {
  props: ['planeData', 'totalWeight', 'totalCogArm', 'isWbCorrect', 'fuelUsage'],
  data() {
    return {
      margin: 20,
      chartSize: 100,
      scaleSize: 5
    }
  },
  methods: {
    normalise(min, max, value) {
      return (value - min) / (max - min) * this.chartSize
    },
    round(number) {
      const { precision = 1000 } = this.planeData
      return Math.round(number * precision) / precision
    }
  },
  computed: {
    scale() {
      let a = new Array(Math.round(this.chartSize / this.scaleSize))
        .fill('')
        .map((cv, i) => `M0 -${i * this.scaleSize} L${this.chartSize} -${i * this.scaleSize} Z`)
      return a
    },
    limits() {
      return [
        `M0 ${0 * this.chartSize} L${this.chartSize} -${0 * this.chartSize}`,
        `M0 ${-1 * this.chartSize} L${this.chartSize} ${-1 * this.chartSize}`,
        `M${0 * this.chartSize} ${0 * this.chartSize} L${0 * this.chartSize} ${-this.chartSize}`,
        `M${1 * this.chartSize} ${0 * this.chartSize} L${1 * this.chartSize} ${-this.chartSize}`
      ]
    },
    viewBox() {
      return `${-this.margin} ${-this.margin-this.chartSize} ${this.chartSize + this.margin * 2} ${this.chartSize + this.margin * 2}`
    },
    textColor() {
      return this.isWbCorrect ? 'green' : 'red'
    },
    fuelUsageLine() {
      const { minCogArm, maxCogArm, minWeight, maxWeight } = this.planeData
      return 'M' + this.fuelUsage.map(i => `${this.normalise(minCogArm, maxCogArm, i.cogArm)} ${-this.normalise(minWeight, maxWeight, i.totalWeight)}`).join(' L')
    },
    normalisedTotalCogArm() {
      const { minCogArm, maxCogArm } = this.planeData
      return this.normalise(minCogArm, maxCogArm, this.totalCogArm)
    },
    normalisedTotalWeight() {
      const { minWeight, maxWeight } = this.planeData
      return this.normalise(minWeight, maxWeight, this.totalWeight)
    }
  },
  mounted() {
    console.log(this.totalCogArm)
  },
  template: vue`
  <div >
    <svg id="chart" :viewBox="viewBox">
      <path v-for="line in scale" :d="line" />
      <path class="limits" v-for="line in limits" :d="line" />
      <path class="fuelUsage" :d="fuelUsageLine" />
      <circle :cx="normalisedTotalCogArm" :cy="-normalisedTotalWeight" r="1" :fill="textColor" />
      <text :x="normalisedTotalCogArm+5" :y="-normalisedTotalWeight+5" :fill="textColor" >{{round(totalWeight)}}</text>
      <text :x="normalisedTotalCogArm+5" :y="-normalisedTotalWeight" :fill="textColor" >{{round(totalCogArm)}}</text>
    </svg>
  </div>
  `
}

function vue(str, exp) {
  return str.raw[0]
}