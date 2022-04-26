import { AWUtilsService } from "../core/utils/utils.service.js";
import { AWPlanesService } from "../core/services/planes.service.js";
import { AWLoadAndWeightService } from "./loadAndWeight.service.js";

const awUtilsSvc = new AWUtilsService();
const awPlanesSvc = new AWPlanesService();
const loadAndWeightSvc = new AWLoadAndWeightService();
export default {
    components: [],
    props: ['selected', 'planesList'],
    data() {
        return {
            selectedPlane: this.selected,
            planeData: false,
            currentDate: new Date()
        }
    },
    async mounted() {
        this.getPlaneData();
    },
    methods: {
        async getPlaneData() {
            this.planeData = false
            this.planeData = await awPlanesSvc.detailsPlane(this.selectedLocal);
        },
        loadWeight({ density = 1, value }) {
            return loadAndWeightSvc.getLoadWeight(density, value);
        },
        loadMoment(load) {
            return loadAndWeightSvc.getLoadMoment(load);
        },
        totalWeight(loads) {
            return loadAndWeightSvc.getSumLoad(loads, this.loadWeight);
        },
        totalMoment(loads) {
            return loadAndWeightSvc.getSumLoad(loads, this.loadMoment);
        },
        cogArm(loads) {
            return loadAndWeightSvc.getCogArm(this.totalMoment(loads), this.totalWeight(loads));
        },
        isWeightCorrect(planeData) {
            const { totalWeight } = this
            return totalWeight(planeData.loads) > planeData.minWeight &&
                totalWeight(planeData.loads) < planeData.maxWeight;
        },
        isBalanceCorrect(planeData) {
            const { cogArm } = this
            return cogArm(planeData.loads) > planeData.minCogArm &&
                cogArm(planeData.loads) < planeData.maxCogArm;
        },
    },
    watch: {
      selected (oldSelected, newSelected) {
        this.getPlaneData();
      }
    },
    model: {
      prop: 'selected'
    },
    computed: {
        selectedLocal: {
          get: function () {
            console.log(this.selected);
            return this.selected;
          },
          set: function (value) {
            this.$emit('selected-change', {
              source: "loadAndWeight component",
              value,
              element: this
            });
          }
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
            for (const fuelName of fuelLoads) {
                const load = clonedLoads.find(i => i.name === fuelName)
                load.value = load.max
                x.push(JSON.parse(JSON.stringify(clonedLoads)))
            }

            return x.map(i => {
                return {
                    totalWeight: this.totalWeight(i),
                    cogArm: this.cogArm(i)
                }
            })
        }
    },
    template: `
    <div id="calculator" >
      <form id="inputs">
        <div class="gridRow" v-if="planeData">
          <span></span>
          <span>Ilość</span>
          <span>Masa</span>
          <span>Ramię</span>
          <span>Moment</span>
        </div>
        <div class="gridRow" v-for="load in planeData.loads">
          <label :for="load.name">{{load.label}}
            <template v-if="load.unit">[{{load.unit}} * {{load.density}}]</template>
          </label>
          <input
            :disabled="load.inputDisabled"
            :type="load.inputType"
            :min="load.min || 0"
            :max="load.max"
            step="0.5"
            v-model="load.value"
            :name="load.name"
            size="10"
            />
          <span>{{loadWeight(load) || '0'}} kg</span>
          <span>{{load.arm || '-'}}</span>
          <span>{{loadMoment(load) || '0'}}</span>
        </div>
        <div class="gridRow bold" v-if="planeData">
          <span>Suma</span>
          <span></span>
          <span :style="{color: isWeightCorrect(planeData) ? 'green' : 'red'}">{{totalWeight(planeData.loads)}} kg</span>
          <span :style="{color: isBalanceCorrect(planeData) ? 'green' : 'red'}">{{cogArm(planeData.loads)}}</span>
          <span>{{totalMoment(planeData.loads)}}</span>
        </div>
        <div class="gridRow bold" v-if="planeData">
          <span>Limity</span>
          <span></span>
          <span>{{planeData.minWeight}} - {{planeData.maxWeight}} kg</span>
          <span>{{planeData.minCogArm}} - {{planeData.maxCogArm}}</span>
          <span></span>
        </div>
      </form>
      <Chart
        v-if="planeData"
        :plane-data="planeData"
        :total-weight="totalWeight(planeData.loads)"
        :total-cog-arm="cogArm(planeData.loads)"
        :is-wb-correct="isWeightCorrect(planeData) && isBalanceCorrect(planeData)"
        :fuel-usage="fuelUsage"
      ></Chart>
    </div>
  `
}