export default {
  data() {
    return {

    }
  },
  methods: {
    async getPlaneData(ev) {
      console.log(ev)
      this.planeData = await requestJSON(ev.target.value)
    },
  },
  computed: {
    totalWeight() {
      return this.sumLoad(this.loadWeight)
    },
    totalMoment() {
      return this.sumLoad(this.loadMoment)
    }
  },
  mounted() {
  },
  template: `
  <svg viewBox="0 0 300 300">
    <path d="M150 0 L75 200 L225 200 Z" />   
  </svg>

  `
}
