export default {
  components: [],
  props: ['selected', 'planesList'],
  data() {
    return {
      currentDate: new Date()
    }
  },
  async mounted() {
    setInterval(() => {
      this.currentDate = new Date()
    }, 1000 * 60)
  },
  methods: {
  },
  model: {
    prop: 'selected'
  },
  computed: {
    selectedLocal: {
      get: function () {
        return this.selected;
      },
      set: function (value) {
        this.$emit('selected-change', {
          source: "awHeader component",
          value,
          element: this
        });
      }
    }
  },
  template: `
    <header>
      <div>
        <label for="planes">Samolot:</label>
        <select v-model="selectedLocal" name="planes" id="planes" autocomplete="off">
          <option disabled selected value>wybierz</option>
          <option v-for="plane in planesList" :value="plane">{{plane.replace(/\.json/,'')}}</option>
        </select>
      </div>
      <div>
        <div>{{currentDate}}</div>
        <div>{{currentDate.toUTCString()}}</div>
      </div>
    </header>
  `
}