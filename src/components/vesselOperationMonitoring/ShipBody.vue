<template>
        <v-layer>

    <v-group>
        <v-image v-for="section in ship.middle" :key="section.id" :config="getSectionConfig(section)"
            @contextmenu.stop.prevent="handleRightClick(section, $event)" />
    </v-group>
  </v-layer>

</template>
    
  <script lang="ts">
  // import Bow from '@/components/vesselOperationMonitoring/assets/Bow.svg'
  
  
  interface Section {
    id: string;
    type: string;
    position: number;
  }
  
  interface Ship {
    head: Section;
    tail: Section;
    middle: Section[];
  }
  
  export default ({
    data: function () {
      return {
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
        sternImage: null,
        bowImage: null,
        ship: {
          head: {
            id: 'head',
            type: 'head',
            position: 0
          },
          tail: {
            id: 'tail',
            type: 'tail',
            position: 1000
          },
          middle: [
            {
              id: '001',
              type: 'middle',
              position: 200
            }
          ]
        },
        showContextMenu: false,
        contextMenuX: 0,
        contextMenuY: 0,
        selectedSection: null as Section | null,
      };
    },
    created() {
      window.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });
    },
    destroyed() {
      window.removeEventListener('contextmenu', (event) => {
        event.preventDefault();
      });
    },
    methods: {
      getSectionConfig(section: Section) {
        return {
          x: section.position,
          y: 150,
          width: 200,
          height: 182,
          image: this.bodyImage, 
          draggable: false
        };
      },
      getHeadConfig() {
        return {
          x: 0,
          y: 150,
          width: 200,
          height: 200,
          image: this.sternImage, 
        };
      },
      getTailConfig() {
        return {
          x: this.ship.tail.position,
          y:120,
          width: 200,
          height: 212,
          image: this.bowImage,
        };
      },
      getSectionColor(section: Section) {
        switch (section.type) {
          case 'bridge':
            return 'green';
          case 'engine':
            return 'yellow';
          default:
            return 'white';
        }
      },
      open(evt) {
        // updates position of context menu 
        this.contextMenuX = evt.pageX || evt.clientX;
        this.contextMenuY = evt.pageY || evt.clientY;
        // make element focused 
        // @ts-ignore
        Vue.nextTick(() => this.$el.focus());
        this.show = true;
      },
      handleRightClick(section: Section, event: any) {
        event.evt.preventDefault();
        this.showContextMenu = true;
        this.contextMenuX = event.evt.pageX || event.evt.clientX;
        this.contextMenuY = event.evt.pageY || event.evt.clientY;
        this.selectedSection = section;
      },
      addSection(direction: 'left' | 'right', section: Section) {
        const index = this.ship.middle.findIndex((s) => s.id === section.id);
        const newSection: Section = {
          id: `${Date.now()}`, // This should be unique
          type: 'hatch', // Set the default type to 'hatch'
          position: direction === 'left' ? section.position - 110 : section.position + 110
        };
  
        if (direction === 'left') {
          this.ship.middle.splice(index, 0, newSection);
        } else {
          this.ship.middle.splice(index + 1, 0, newSection);
        }
  
        this.showContextMenu = false;
      },
      deleteSection(section: Section) {
        this.ship.middle = this.ship.middle.filter((s) => s.id !== section.id);
        this.showContextMenu = false;
      }
    },
    computed: {
      // get position of context menu
      style() {
        return {
          top: this.contextMenuY + 'px',
          left: this.contextMenuX + 'px',
        };
      },
    },
    mounted() {
      const sternImage = new window.Image();
      sternImage.src = 'media/svg/vesselProfile/Stern.svg';
      sternImage.onload = () => {
        // set image only when it is loaded
        this.sternImage = sternImage;
      };
      const bowImage = new window.Image();
      bowImage.src = 'media/svg/vesselProfile/Bow.svg';
      bowImage.onload = () => {
        // set image only when it is loaded
        this.bowImage = bowImage;
      };
      const bodyImage = new window.Image();
      bodyImage.src = 'media/svg/vesselProfile/Body.svg';
      bodyImage.onload = () => {
        // set image only when it is loaded
        this.bodyImage = bodyImage;
      };
    },
  });
  </script>
    
  <style>
  .context-menu {
    position: fixed;
    background: white;
    z-index: 999;
    outline: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    cursor: pointer;
  }
  
  .stage-wrapper {
    overflow-x: auto;
    width: 100%;
  }
  </style>
    