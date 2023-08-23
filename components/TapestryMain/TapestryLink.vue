<template>
  <transition name="fade">
    <line
      v-show="show"
      :data-qa="`link-${source.id}-${target.id}`"
      :class="{
        'half-opaque':
          (!source.accessible && source.hideWhenLocked) ||
          (!target.accessible && target.hideWhenLocked),
        opaque:
          !visibleNodes.includes(source.id) || !visibleNodes.includes(target.id),
        disabled: !isLoggedIn,
        highlighted: highlighted,
      }"
      :x1="source.coordinates.x"
      :x2="target.coordinates.x"
      :y1="source.coordinates.y"
      :y2="target.coordinates.y"
      @click="openLinkModal"
      :stroke="stroke"
    ></line>
  </transition>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import { names } from "@/config/routes"
import * as wp from "@/services/wp"
import { arrayMove } from "vue-slicksort"

export default {
  name: "tapestry-link",
  props: {
    source: {
      type: Object,
      required: true,
    },
    target: {
      type: Object,
      required: true,
    },
    link: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(["visibleNodes", "rootId", "highlightedLinks"]),
    ...mapGetters(["getNeighbours", "isVisible"]),
    show() {
      return this.isVisible(this.source.id) && this.isVisible(this.target.id)
    },
    isLoggedIn() {
      return wp.isLoggedIn()
    },
    highlighted() {
      return this.highlightedLinks.some((link) => link.source === this.source.id && link.target === this.target.id)
    },
    stroke() {
      if(!this.link.comparisonValue) {
        return "#006C92"
      }
      if(this.link.comparisonValue > 90) {
        return "#006C92"
      }
      if(this.link.comparisonValue > 80) {
        return "#1DADE1"
      }
      return "#66A7BE"
    },
  },
  methods: {
    openLinkModal() {
      this.$router.push({
        name: names.LINKMODAL,
        params: {
          source: this.source.id,
          target: this.target.id,
        },
        query: this.$route.query,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
line {
  stroke-width: 2;
  position: relative;

  &:hover {
    cursor: pointer;
    stroke: #3498db;
    stroke-width: 11;
  }
}

.highlighted {
  stroke: #3498db;
  stroke-width: 11;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.half-opaque {
  opacity: 0.6;
}

.opaque {
  opacity: 0.2;
}

.disabled {
  &:hover {
    cursor: not-allowed;
    stroke: #999;
    stroke-width: 6;
  }
}
</style>
