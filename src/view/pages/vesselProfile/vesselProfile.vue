<template>
    <main>


        <!-- navbar start -->

        <div class="subheader px-0 subheader-solid MySubheader toolabar" id="toolbar">
            <div class="
          container-fluid
          d-flex
          align-items-center
          justify-content-between
          flex-wrap flex-sm-nowrap
        ">
                <div class="d-flex align-items-center flex-wrap mr-2">
                    <h5 class="font-weight-bolder text-dark mb-0 mr-1 MySubHeaderTitle text-muted">
                        Vessel Profile
                    </h5>

                    <div class="
              subheader-separator subheader-separator-ver
              mt-2
              mb-2
              ml-4
              mr-4
              bg-gray-100
            "></div>

                    <ul class="
              breadcrumb breadcrumb-transparent breadcrumb-dot
              font-weight-bold
              p-0
              my-2
            ">
                        <span class="text-muted"> Side View Design </span>
                        <div class="
                subheader-separator subheader-separator-ver
                mt-2
                mb-2
                ml-4
                mr-4
                bg-gray-100
              "> </div>
              <span class="text-muted"> {{ vesselProfileName }} </span>

                    </ul>
                </div>

                <!--begin::Toolbar-->
                <div class="d-flex align-items-center">

                    <button type="button" @click="onRefresh" class="
              btn btn-outline-primary
              font-weight-bold
              btn-sm
              mr-2
              Mybtn1-primary
              Mybtn-size1
            ">
                        <i class="fas fa-sync-alt"></i>
                        <span class="hideButtonTitle">REFRESH</span>
                    </button>

                    <!-- start Save -->
                    <button type="button" @click="onSave" class="
              btn btn-outline-primary
              font-weight-bold
              btn-sm
              mr-2
              Mybtn1-primary
              Mybtn-size1
            " :style="{ width: '100px', marginBottom: '20px', marginTop: '20px', backgroundColor: '#22b9ff', color: 'white', borderRadius: '20px' }">
                        <i class="fas fa-save"></i>
                        <span class="hideButtonTitle">SAVE</span>
                    </button>
                    <!-- end Save -->
                </div>

                <!--end::Toolbar-->
            </div>
        </div>

        <!-- navbar end -->



        <div class="page-control container-fluid">
            <BlockUI v-if="getIsLoading()" :message="loadingMessage">
                <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
            </BlockUI>
            <vue-confirm-dialog></vue-confirm-dialog>




            <ship-component />

            <div class="py-4 px-16"
                :style="{ border: '1px solid #A0A0A0', marginTop: '60px', marginBottom: '60px', borderRadius: '5px' }"
                style="margin-top: 8px;">
                <div class="input-group">
                    <div class="w-60">
                        <input min="0" id="fore" type="checkbox" class="form-check-input" :checked="hasBayFore"
                            name="hasBayFore" @change="onBayExistChange" />
                        <label for="fore" class="form-check-label">Fore</label>
                    </div>
                    <div style="width: 100px;">
                        <input type="number" class="form-control bg-white" :value="String(selectedHatchData.bayFore).padStart(2, '0')" name="bayFore"
                            @change="onBayNumberChange" disabled />

                    </div>
                </div>

                <div class="input-group">
                    <div class="w-60">
                        <input min="0" id="40foot" type="checkbox" class="form-check-input" :checked="hasBay40"
                            name="hasBay40" @change="onBayExistChange" />
                        <label for="40foot" class="form-check-label">40 Foot</label>
                    </div>
                    <div style="width: 100px;">
                        <input type="number" class="form-control bg-white" :value="String(selectedHatchData.bay40).padStart(2, '0')" name="bay40"
                            @change="onBayNumberChange" disabled />
                    </div>
                </div>

                <div class="input-group">
                    <div class="w-60">
                        <input min="0" id="after" type="checkbox" class="form-check-input" :checked="hasBayAfter"
                            name="hasBayAfter" @change="onBayExistChange" />
                        <label for="after" class="form-check-label">After</label>
                    </div>
                    <div style="width: 100px;">

                        <input type="number" class="form-control bg-white" :value="String(selectedHatchData.bayAfter).padStart(2, '0')"
                            name="bayAfter" @change="onBayNumberChange" disabled />

                    </div>
                </div>


            </div>


            <div v-if="selectedHatchData.hasBayFore || selectedHatchData.hasBayAfter || selectedHatchData.hasBay40"
                class="controls">
                <div class="controls__types">
                    <span>Cell Type:</span>
                    <span @click="selectContainerType('standard')"
                        :class="{ selected: selectedContainerType === 'standard' }">Standard</span>
                    <span @click="selectContainerType('reefer')"
                        :class="{ selected: selectedContainerType === 'reefer' }">Reefer</span>
                    <span @click="selectContainerType('45foot')"
                        :class="{ selected: selectedContainerType === '45foot' }">45
                        Foot</span>
                </div>
                <div class="controls__actions">
 
                    <label class="form-check-label">
                        <input id="radioMirror" type="checkbox" class="form-check-input" v-model="mirrorMode" />
                        Mirror Action
                    </label>
                </div>
            </div>

            <div class="row p-5 gap-1">
                <div v-if="selectedHatchData.hasBayFore" class="col-sm p-0 pr-1">
                    <bay-full :data="{ onDeck: selectedHatchData.onDeckFore, underDeck: selectedHatchData.holdFore }"
                        rel="Fore" :name="selectedHatchData.bayFore"
                        :selected-container-type="selectedContainerType" :mirrorMode="mirrorMode" />
                </div>
                <div v-if="selectedHatchData.hasBay40" class="col-sm p-0 px-1"
                    :selected-container-type="selectedContainerType" :mirrorMode="mirrorMode">
                    <bay-full :data="{ onDeck: selectedHatchData.onDeck40, underDeck: selectedHatchData.hold40 }" rel="40"
                        :name="selectedHatchData.bay40" :selected-container-type="selectedContainerType"
                        :mirrorMode="mirrorMode" />
                </div>
                <div v-if="selectedHatchData.hasBayAfter" class="col-sm p-0 pl-1"
                    :selected-container-type="selectedContainerType" :mirrorMode="mirrorMode">
                    <bay-full :data="{ onDeck: selectedHatchData.onDeckAfter, underDeck: selectedHatchData.holdAfter }"
                        rel="After" :name="selectedHatchData.bayAfter"
                        :selected-container-type="selectedContainerType" :mirrorMode="mirrorMode" />
                </div>
            </div>
        </div>
    </main>
</template>
  
<script lang="ts">
import BayFull from '@/components/vesselOperationMonitoring/BayFull.vue'
import ShipSideView from '@/components/vesselOperationMonitoring/ShipSideView.vue'
import { VesselProfileData } from '@/core/services/store/vesselProfile.module'
import Vue from "vue";
import { FETCH_VESSEL_PROFILE } from '@/core/services/store/vesselProfile.module'

import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    components: {
        BayFull,
        ShipComponent: ShipSideView
    },
    inject: ["showErrors", "showSuccess", "showWarning", "isStandalone"],
    data: () => ({
        loadingMessage: 'Please wait ...',
        loading: false,
        selectedContainerType: 'standard',
        mirrorMode: false,
        width: 100,
        height: 100,
        bayData: [
            {
                name: 'Bay 01',
                containers: []
            }
        ],
    }),
    computed: {
        ...mapGetters({
            vesselProfile: 'getVesselProfile',
            selectedHatchId: 'getSelectedVesselProfile',
            selectedHatchIndex: 'getSelectedHatchIndex',
            selectedHatchData: 'getSelectedHatchData'
        }),
        vesselProfileName() {
            return this.$store.state.vesselProfile.vesselProfile.vesselProfileName
        },
        hasBayFore() {
            
            return this.selectedHatchData.hasBayFore
        },
        hasBay40() {
            return this.selectedHatchData.hasBay40
        },
        hasBayAfter() {
            return this.selectedHatchData.hasBayAfter
        },
        ...mapActions({
            setSelectedHatchData: 'setSelectedHatchData',
            setIsLoading: 'setIsLoading'
        }),
        // selectedHatchData() {
        //     const vesselProfileHatches = this.$store.state.vesselProfile.vesselProfile.vesselProfileHatches
        //     const selectedHatchIndex = this.$store.state.vesselProfile.selectedHatchIndex
        //     // 
        //     return vesselProfileHatches[selectedHatchIndex]
        // },


        // function () {
        //     const selectedHatch = this.vesselProfile.vesselProfileHatches[this.selectedHatchIndex]
        //     
        //     return selectedHatch
        // }
    },
    methods: {
        onSave() {
            this.postVesselProfile().
            then((data)=>  {
                const vm = this
                
                vm.showErrors(data.message)})
            this.loading = true
        },
        onRefresh() {
            const vm = this;
            this.loading = true
            this.$store.dispatch(FETCH_VESSEL_PROFILE, +this.$route.params.id ?? 1)
                .then((data) => console.log('kaler', data.message))
                .catch((error) => vm.showSuccess(error.message))
                .finally(() => {
                    this.loading = false
                })
        },
        getIsLoading() {
            return this.$store.state.vesselProfile.isLoading
        },
        postVesselProfile() {
            return this.$store.dispatch('postVesselProfile')
        },
        selectContainerType(type: string) {
            this.selectedContainerType = type
        },
        onBayNumberChange(event) {
            
            this.$store.dispatch('setSelectedHatchData', { [event.target.name]: event.target.value })
        },
        onBayExistChange(event) {
            this.$store.dispatch('setSelectedHatchData', { [event.target.name]: event.target.checked })
        }
    },
    mounted() {
        this.$store.dispatch(FETCH_VESSEL_PROFILE, +this.$route.params.id ?? 1)
            .then(() => console.log('fafa', this.vesselProfile))
            .catch((error) => console.error(error.message))
    },

}

</script>

<style scoped>
.w-60 {
    width: 60px;
}

.toolabar {
    position: sticky;
}

.page-control {
    background-color: #fff;
    padding-top: 50px;
}

.controls {
    display: flex;
    justify-content: center;
    padding: 10px;
}

.controls span {
    cursor: pointer;
    margin-left: 50px;
}

.controls span.selected {
    font-weight: bold;
}

.controls__types {
    display: flex;
    justify-content: center;
    margin-right: 20px
}

.controls__actions {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-left: 50px;
}

.input-group {
    display: flex;
    align-items: center;
    gap: 10px
}

input {
    text-align: center;
}
</style>
  