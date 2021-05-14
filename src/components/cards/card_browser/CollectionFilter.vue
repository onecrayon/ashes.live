<template>
  <div>
    <button
      :disabled="isDisabled"
      :class="{ active: isOpen, 'rounded-b-none': isOpen }"
      class="btn py-1 px-2 font-normal text-sm"
      ref="button"
      @click="togglePopup">
      <i class="fa-filter" :class="{ fas: filtersActive, far: !filtersActive }"></i> <span class="hidden sm:inline">Releases</span>
      <span v-if="filtersActive" class="alt-text"> (active)</span>
    </button>
    <div ref="popup" class="absolute z-50" :class="{ hidden: !popper }">
      <transition name="fade" @after-leave="cleanupPopper">
        <div v-if="isOpen" class="w-80 max-h-80 border-2 border-black bg-white rounded-md rounded-tr-none text-black">
          <div class="flex flex-nowrap" role="group" aria-label="Show cards:">
             <button
              class="flex-auto btn btn-first rounded-none border-t-0 border-l-0 rounded-tl-sm"
              :class="{ 'active': filterLogic === 'all' }"
              @click="filterLogic = 'all'">
              All
            </button
            ><button
              class="flex-auto btn btn-last rounded-none border-t-0 border-r-0"
              :class="{ 'active': filterLogic === 'mine' }"
              @click="filterLogic = 'mine'">
              Mine
            </button>
          </div>
          <!-- TODO: add list of collections here -->
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core'
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import { request } from '/src/utils/index.js'

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
  emits: ['update:filterLogic', 'update:releaseList'],
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  data: () => ({
    popper: null,
    isOpen: false,
    loadingCollections: false,
    allCollections: [],
  }),
  computed: {
    filtersActive () {
      return this.filterLogic !== 'all' || this.releaseList.length
    },
  },
  methods: {
    async togglePopup () {
      if (this.popper) {
        // If this.isOpen is false, then we're mid clean-up as we animate out, so just ignore
        if (this.isOpen) {
          this.isOpen = false
        }
        return
      }
      // Otherwise, we need to create our popper and open 'er up
      if (this.loadingCollections) return
      this.loadingCollections = true
      try {
        const params = {}
        if (this.showLegacy) {
          params.show_legacy = true
        }
        this.allCollections = await request('/v2/releases', { params })
      } catch (e) {
        this.handleResponseError(e)
        return
      } finally {
        this.loadingCollections = false
      }
      this.popper = createPopper(this.$refs.button, this.$refs.popup, {
        placement: 'bottom-end',
      })
      this.isOpen = true
      // If we don't run an update on the next tick, the popper treats its size as 0 width/height
      // No idea why; even setting an explicit size in the styling doesn't help
      this.$nextTick(() => {
        this.popper.forceUpdate()
      })
    },
    cleanupPopper () {
      this.popper.destroy()
      this.popper = null
    }
  },
}
</script>
