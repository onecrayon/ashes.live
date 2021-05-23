<template>
  <div class="relative">
    <button
      :disabled="isDisabled"
      :class="{ active: isOpen, 'rounded-b-none': isOpen }"
      class="btn py-1 px-2 font-normal text-sm"
      ref="button"
      @click="togglePopup">
      <i class="fa-filter" :class="{ fas: filtersActive, far: !filtersActive }"></i> <span class="hidden sm:inline">Releases</span>
      <span v-if="filtersActive" class="alt-text"> (active)</span>
    </button>
    <div ref="popup" class="absolute z-50 right-0" :class="{ hidden: !popup }">
      <transition name="fade" @after-leave="popup = false">
        <div v-if="isOpen" class="w-80 max-h-80 border-2 border-black bg-white rounded-md rounded-tr-none text-black flex flex-col">
          <div class="flex flex-nowrap flex-none" role="group" aria-label="Show cards:">
             <button
              class="flex-auto btn btn-first rounded-none border-t-0 border-l-0 rounded-tl-sm"
              :class="{ 'active': targetFilterLogic === 'all' }"
              @click="setFilterMine(false)">
              All
            </button
            ><button
              class="flex-auto btn btn-last rounded-none border-t-0 border-r-0"
              :class="{ 'active': targetFilterLogic === 'mine' }"
              :disabled="anonymousUser"
              @click="setFilterMine(true)">
              Mine
            </button>
          </div>
          <div class="p-2 overflow-y-auto flex-auto">
            <toggle v-if="targetFilterLogic === 'all'" v-model="showEverything"><span class="ml-2">Show everything</span></toggle>
            <span v-else>Choose the releases you own:</span>
            <ul class="grid grid-cols-2 gap-x-2 gap-y-1 py-2">
              <li
                v-for="release of allCollections" :key="release.stub"
                class="flex flex-nowrap items-start"
                :class="{'col-span-2': release.stub === 'master-set' || release.stub === 'core-set'}">
                <input type="checkbox" class="flex-none mt-1 mr-1"
                  :id="release.stub"
                  :disabled="targetFilterLogic === 'all' && showEverything"
                  :value="selectedReleases.has(release.stub)"
                  :checked="selectedReleases.has(release.stub)"
                  @input="selectedReleases.has(release.stub) ? selectedReleases.delete(release.stub) : selectedReleases.add(release.stub)">
                <label class="flex-initial text-sm" :class="{'text-gray': targetFilterLogic === 'all' && showEverything}" :for="release.stub">{{ release.name }}</label>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import { request } from '/src/utils/index.js'
import Toggle from '../../shared/Toggle.vue'

export default {
  name: 'CollectionFilter',
  props: {
    isDisabled: Boolean,
    showLegacy: Boolean,
    filterLogic: {
      default: 'all',
      type: String,
    },
    releaseList: {
      default: [],
      type: Array,
    },
  },
  emits: ['update:filterLogic', 'update:releaseList', 'forceFiltration'],
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  components: {
    Toggle,
  },
  data: instance => ({
    popup: false,
    isOpen: false,
    loadingCollections: false,
    allCollections: [],
    showEverything: instance.releaseList.length === 0 || instance.filterLogic === 'mine',
    targetFilterLogic: instance.filterLogic,
    selectedReleases: new Set(),
  }),
  computed: {
    filtersActive () {
      return this.filterLogic !== 'all' || this.releaseList.length
    },
    anonymousUser () {
      return !this.$store.getters['player/isAuthenticated']
    },
    myReleases () {
      return this.allCollections.reduce((endList, curObj) => {
        if (curObj.is_mine) endList.push(curObj.stub)
        return endList
      }, [])
    },
  },
  methods: {
    async togglePopup () {
      if (this.popup) {
        // If this.isOpen is false, then we're mid clean-up as we animate out, so just ignore
        if (this.isOpen) {
          // First handle sending the updated data, if necessary
          if (this.targetFilterLogic === 'all') {
            if (this.showEverything && this.releaseList.length) {
              // We're showing everything, so clear out the release list
              this.$emit('update:releaseList', [])
            } else if (!this.showEverything && this.selectedReleases.size) {
              // We're not showing everything, and we selected some releases to filter by
              this.$emit('update:releaseList', Array.from(this.selectedReleases))
            }
          } else {
            // If showing "mine", make sure to patch the user's collection first
            try {
              await request('/v2/releases/mine', {
                method: 'put',
                data: Array.from(this.selectedReleases),
              })
              // If the only change was to adjust the collection, we need to force the filter,
              // because otherwise nothing will change as far as the front-end is concerned (the
              // collection is only persisted on the server)
              if (this.targetFilterLogic === this.filterLogic) {
                this.$emit('forceFiltration')
              }
            } catch (e) {
              this.handleResponseError(e)
            }
          }
          // Set our filter logic; we always fire this off to ensure that the card list refreshes
          // even if the only change was the modify the user's collection
          if (this.targetFilterLogic !== this.filterLogic) {
            this.$emit('update:filterLogic', this.targetFilterLogic)
          }
          // And finally set to "show everything" if nothing was selected when closing the popup
          if (this.filterLogic === 'all' && !this.selectedReleases.size) {
            this.showEverything = true
          }
          // And finally close the popover
          this.isOpen = false
        }
        return
      }
      // Otherwise, we need to gather our data and open 'er up
      if (this.loadingCollections) return
      this.loadingCollections = true
      try {
        const params = {}
        if (this.showLegacy) {
          params.show_legacy = true
        }
        this.allCollections = (await request('/v2/releases', { params })).data
      } catch (e) {
        this.handleResponseError(e)
        return
      } finally {
        this.loadingCollections = false
      }
      if (this.filterLogic === 'all') {
        this.selectedReleases = new Set(this.releaseList)
      } else {
        this.selectedReleases = new Set(this.myReleases)
      }
      this.popup = true
      this.isOpen = true
    },
    setFilterMine (showMine) {
      this.targetFilterLogic = showMine ? 'mine' : 'all'
      if (this.targetFilterLogic === 'mine') {
        this.selectedReleases = new Set(this.myReleases)
      } else {
        this.selectedReleases = new Set(this.releaseList)
      }
    },
  },
}
</script>
