<script>
import BayOnDeck from '@/components/vesselOperationMonitoring/BayOnDeck.vue'
import BayUnderDeck from '@/components/vesselOperationMonitoring/BayUnderDeck.vue'


export default {


    props: {
        name: {
            type: Number,
            default: 1
        },
        selectedContainerType: {
            default: 'standard'
        },
        mirrorMode: {
            default: false
        },
        data: {
            default: {
                onDeck: {
                    cols: 4,
                    rows: 4,
                    cells: [{ existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }],
                },
                underDeck: {
                    cols: 4,
                    rows: 4,
                    cells: [{ existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }, { existed: true, isReefer: false, is45Foot: false }],
                }
            }
        },
        rel: {
            default: ''
        },
    },
    data() {
        return {
            isMirrored: this.$store.state.vesselProfile.mirroredBays[this.rel]
        }
    },
    methods: {
        toggleMirror() {
            
            this.isMirrored = !this.isMirrored
            

        }
    },
    computed: {
        setMirroredBays: function(payload) {
            this.isMirrored = !this.isMirrored
            this.$store.dispatch('setMirroredBays', {[this.rel]: this.isMirrored})
            return this.isMirrored
        }
    },
    components: {
        BayOnDeck,
        BayUnderDeck
    },
}

</script>

<template>
    <main class="">
        <div style="display: flex; gap: 2px; justify-content: start; align-items: center; margin: 0; margin-bottom: 5px; ">
            <input :id="'isMirror' + this.name  " type="checkbox" @click="setMirroredBays()" v-model="isMirrored"
            :class="{ selected: selectedContainerType === '45foot' }" />
            <label :for="'isMirror' + this.name " style="margin: 0; font-weight: bold;">Mirror</label>
        </div>
        <div class="d-grid justify-content-center gap-3  ">
            <div class="bay-view col-smflex justify-content-center p-1 py-5" :style="{borderColor: '#A0A0A0', borderWidth: '1px', borderStyle: 'solid', borderRadius: '5px'}" >
                <h3 class="text-center">Bay {{ String(name).padStart(2, '0') }}</h3>


                <bay-on-deck :rel="this.rel" :data="data.onDeck" :mirrorMode="mirrorMode"
                    :selectedContainerType="selectedContainerType" />
                <bay-under-deck :rel="this.rel" :data="data.underDeck" :mirrorMode="mirrorMode"
                    :selectedContainerType="selectedContainerType" />
            </div>
        </div>
    </main>
</template>

<style scoped></style>