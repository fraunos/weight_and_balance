export default {
  data() {
    return { 
      selectedPlane: "",
      planesList: [],
      planeData: {}
    }
  },
  async mounted(){
    this.planesList = await requestJSON('/planes')
  },
  methods: {
    async getPlaneData(ev) {
      console.log(ev)
      this.planeData = await requestJSON(ev.target.value)
    },
    loadWeight({density = 1, value}) {
      return Math.round(density * value * 10) / 10
    }
  },
  computed: {
    totalWeight() {
      const sum =  this.planeData.loads?.map(i=>({density: i.density ?? 1, value: i.value}))
        .filter(i=>i.density && i.value)
        .reduce((acc,cv)=>{
          return cv.density * cv.value + acc
      }, 0)
      return sum
    }
  }
}

async function requestJSON(url){
  const res = await fetch(url)
  const data = await res.json()
  return data
}