<template>
  <div id="container">
    <v-stage class="hatch-grid" :config="configKonva">
      <v-layer>
        <!-- X Axis labels -->
        <v-text v-for="(value, index) in getXLabels()" :key="`x-label-${index}`"
          :config="getXLabelConfig(value, index)" />

        <!-- Y Axis labels -->
        <v-text v-for="(value, index) in getYLabels()" :key="`y-label-${index}`"
          :config="getYLabelConfig(value, index)" />

        <!-- Rectangles -->
        <v-group v-for="(container, containerIndex) in containers" :key="container.id" :config="{ x: 0, y: 0 }">
          <v-rect :config="container" @click="handleClick(containerIndex, container)" />
          <v-text
            :config="{ ...textConfig, text: container.isReefer ? 'RE' : container.is45Foot ? '45' : '', x: container.x + 2, y: container.y + 2, listening: false }" />
            <!-- <v-text
            :config="{ ...textConfig, text: containerIndex, x: container.x + 2, y: container.y + 2 }" /> -->
        </v-group>
      </v-layer>
    </v-stage>
  </div>
</template>

<script lang="ts">
import { v4 as uuid } from 'uuid';
import { mapGetters } from 'vuex';

const CELL_WIDTH = 20


interface Container {
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  stroke: string,
  strokeWidth: number,
  type: string
}

export default Vue.extend({
  props: {
    rel: {
      default: ''
    },
    data: {
      default: {
        cols: 4,
        rows: 4,
        cells: [{ existed: true, isReefer: true, is45Foot: false }],
      }
    },
    name: {
      default: 'Bay 01',
      type: String
    },
    selectedContainerType: {
      default: 'standard',
    },
    mirrorMode: {
      default: ''
    }
  },
  data() {
    return {
      // containers: this.data.cells.map((c, index) => ({ ...c, id: uuid(), x: (index % this.data.cols) * 30 + 50, y: (index % this.data.rows) * 30 + 5, width: 30, height: 30, fill: 'gray', stroke: 'black', strokeWdith: 0.5, type: 'standard' })),

      textConfig: {
        fontSize: 10,
        fill: '#D0D0D0'
      },
      // @ts-ignore

      // Array(this.cols).fill().map((_, i) => Array(this.cols).fill().map((_, j) => ({
      //   id: `${i}-${j}`,
      //   x: 50 + j * 40,
      //   y: 40 + i * 40,
      //   width: 40,
      //   height: 40,
      //   fill: 'gray',
      //   stroke: 'black',
      //   strokeWidth: 0.5,
      //   draggable: false,
      //   type: 'standard'
      // } as Container))).flat()
    }
  },
  methods: {
    selectContainerType(type: string) {
      this.selectedContainerType = type
    },
    setSelectedHatchData(input) {
      this.$store.dispatch('setSelectedHatchCells', { ...input })
    },
    toggleCellProperty(hatchIndex, cellIndex, property, currentValue) {
      this.$store.dispatch('toggleCellProperty', { hatchIndex, deckPosition: 'onDeck' , bayType: this.rel, cellIndex, property, currentValue });
    },

    handleClick(containerIndex: number, container: any) {
      this.updateContainer(container, containerIndex)

      
      if (this.mirrorMode === true) {
        const currentRowIndex = Math.floor(containerIndex / this.data.cols)
        const currentColumnIndex = containerIndex % this.data.cols
        const mirrorColumnIndex = (this.data.cols) - currentColumnIndex
        const mirrorIndex = currentRowIndex * this.data.cols + mirrorColumnIndex - 1

        if (mirrorIndex !== containerIndex)
          this.updateContainer(container, mirrorIndex)
        if (this.containers[mirrorIndex].fill !== this.containers[containerIndex].fill) {
          this.updateContainer(container, mirrorIndex)
        }
      }
    },

    // TODO: update container with click
    updateContainer(container, cellIndex) {
      // const Foundcontainer = this.containers.find(c => c.id === id)
      if (this.selectedContainerType === 'standard') {
        this.toggleCellProperty(this.selectedHatchIndex, cellIndex, 'existed', container.existed)
      } else if (this.selectedContainerType === 'reefer') {
        this.toggleCellProperty(this.selectedHatchIndex, cellIndex, 'isReefer', container.isReefer)
      } else if (this.selectedContainerType === '45foot') {
        this.toggleCellProperty(this.selectedHatchIndex, cellIndex, 'is45Foot', container.is45Foot)
      }
    },
    getXLabels() {
      let labels = []
      let middle = this.data.cols % 2 === 0 ? this.data.cols / 2 : Math.floor(this.data.cols / 2)
      let startNumber = this.data.cols % 2 === 0 ? 1 : 0
      for (let i = 0; i < this.data.cols; i++) {
        if (this.data.cols % 2 === 0) {
          labels[middle + Math.floor((i * ((-1) ** i)) / 2)] = (i + 1).toString().padStart(2, '0')
        } else {
          labels[middle + Math.ceil((i * ((-1) ** (i - 1))) / 2)] = (startNumber + i).toString().padStart(2, '0')
        }
      }
      return labels
    },
    getYLabels() {
      let labels = []
      for (let i = this.data.rows - 1; i >= 0; i--) {
        labels.push((80 + i * 2).toString())
      }
      return labels
    },
    getXLabelConfig(value: string, index: number) {
      return {
        text: value,
        x: 55 + index * CELL_WIDTH,
        y: 5,
        fontSize: 11,
        listening: false,
        fill: '#707070'
      }
    },
    getYLabelConfig(value: string, index: number) {
      return {
        text: value.toString(),
        x: this.data.cols * CELL_WIDTH + 55,
        y: 5 + CELL_WIDTH + index * CELL_WIDTH,
        fontSize: 11,
        listening: false,
        fill: '#707070'
      }
    }
  },
  computed: {
    ...mapGetters({
          selectedHatchData: 'getSelectedHatchData',
          selectedHatchIndex: 'getSelectedHatchIndex',
        }),
    configKonva() {
      return {
        width: 100 + this.data.cols * CELL_WIDTH,
        height: this.data.rows * CELL_WIDTH + 20
      }
    },
    containers() {
      const cols = this.data.cols
      const rows = this.data.rows
      // Add properties neeeded for ui
      const newContainers = this.data.cells.map((c, index) => ({ ...c, id: uuid(), index: index, x: ((index % cols)) * CELL_WIDTH + 50, y: (rows - 1 - Math.floor(index / cols)) * CELL_WIDTH + 20, width: CELL_WIDTH, height: CELL_WIDTH, fill: c.existed ? '#5B646B' : 'white', stroke: '#A0A0A0', strokeWidth: 0.3, type: 'standard'}))
      return newContainers
    },
    tester() {
    }
  },
  mounted() {
  }
})
</script>

<style scoped>
#container {
}


.hatch-grid {
  display: grid;
  place-items: center;
}
</style>
