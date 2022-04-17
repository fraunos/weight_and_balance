export default {
  props: ['planeData', 'weight', 'cogArm'],
  data() {
    return {
      margin: 100,
      scaleSize: 50,
      chartSize: 1000
    }
  },
  methods: {
    async getPlaneData(ev) {
      console.log(ev)
      this.planeData = await requestJSON(ev.target.value)
    },
  },
  computed: {
    scale() {
      let a = new Array(this.chartSize/this.scaleSize)
        .fill('')
        .map((cv, i)=>`M0 -${i*this.scaleSize} L1000 -${i*this.scaleSize} Z`)
      return a
      },
    limits() {
      let {MTOW, min, cogArmMin, cogArmMax} = this.planeData
      return [
        `M0 -${MTOW} L1000 -${MTOW}`,
        `M0 -${min} L1000 -${min}`,
        `M${cogArmMin*1000} -1000 L${cogArmMin*1000} 1000`,
        `M${cogArmMax*1000} -1000 L${cogArmMax*1000} 1000`
      ]
      },
    viewBox(){
      let {planeData: pd, margin} = this
      return `0 -${pd.MTOW+margin} 500 ${pd.MTOW-pd.min+margin*2}`
      // return `0 -1000 1000 1000`
    },
    isWBcorrect() {
      let {planeData: pd, weight, cogArm} = this
      return weight > pd.min &&
        weight < pd.MTOW &&
        cogArm > pd.cogArmMin &&
        cogArm < pd.cogArmMax
    }
  },
  mounted() {
  },
  template: vue`
  <div id="chart">
    <svg :viewBox="viewBox">
      <path v-for="line in scale" :d="line" />
      <path class="limits" v-for="line in limits" :d="line" />
      <circle :cx="cogArm*1000" :cy="-weight" r="1%" :fill="isWBcorrect ? 'green' : 'red'" />
      <text :x="cogArm*1000+20" :y="-weight+20" :fill="isWBcorrect ? 'green' : 'red'" >{{weight}} kg</text>
      <text :x="cogArm*1000+20" :y="-weight" :fill="isWBcorrect ? 'green' : 'red'" >{{cogArm}}</text>
    </svg>
  </div>
  `
}

function vue(str, exp){
  return str.raw[0]
}