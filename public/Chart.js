export default {
  props: ['planeData', 'totalWeight', 'totalCogArm', 'isWbCorrect'],
  data() {
    return {
      margin: 100,
      scaleSize: 10,
      cogScale: 2000,
      chartSize: 1000
    }
  },
  methods: {
  },
  computed: {
    scale() {
      let a = new Array(this.chartSize/this.scaleSize)
        .fill('')
        .map((cv, i)=>`M0 -${i*this.scaleSize} L1000 -${i*this.scaleSize} Z`)
      return a
      },
    limits() {
      const {maxWeight, minWeight, minCogArm, maxCogArm} = this.planeData
      const {cogScale} = this
      return [
        `M0 -${maxWeight} L1000 -${maxWeight}`,
        `M0 -${minWeight} L1000 -${minWeight}`,
        `M${minCogArm*cogScale} -1000 L${minCogArm*cogScale} 1000`,
        `M${maxCogArm*cogScale} -1000 L${maxCogArm*cogScale} 1000`
      ]
      },
    viewBox(){
      const {planeData: pd, margin, cogScale} = this
      return `${pd.minCogArm*cogScale-margin} -${pd.maxWeight+margin} ${(pd.maxCogArm-pd.minCogArm)*cogScale+margin*2} ${pd.maxWeight-pd.minWeight+margin*2}`
    },
    textColor(){
      return this.isWbCorrect ? 'green' : 'red'
    }
  },
  mounted() {
  },
  template: vue`
  <div id="chart">
    <svg :viewBox="viewBox">
      <path v-for="line in scale" :d="line" />
      <path class="limits" v-for="line in limits" :d="line" />
      <circle :cx="totalCogArm*cogScale" :cy="-totalWeight" r="1%" :fill="textColor" />
      <text :x="totalCogArm*cogScale+20" :y="-totalWeight+20" :fill="textColor" >{{totalWeight}} kg</text>
      <text :x="totalCogArm*cogScale+20" :y="-totalWeight" :fill="textColor" >{{totalCogArm}}</text>
    </svg>
  </div>
  `
}

function vue(str, exp){
  return str.raw[0]
}