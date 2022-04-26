export default {
  components: {},
  data() {
    return {
      selectedPlane: 'SP-RAM.json',
      planesList: []
    }
  },
  async mounted() {
    this.planesList = await requestJSON('/planes');
  },
  methods: {
    onSelectedChange: function (event) {
      console.log(event);
      this.selectedPlane = event.value;
    }
  },
  computed: {}
}

async function requestJSON(url) {
  const res = await fetch(url)
  const data = await res.json()
  return data
}