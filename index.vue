<template>
  <main id="tapestry" ref="app" :style="background">
    <div v-if="empty">
      <root-node-button v-if="canEdit && (uploadPDFClicked || writePromptClicked || createYourselfClicked)" @click="addRootNode"></root-node-button>
      <div v-else class="empty-message">The requested Tapestry is empty.</div>
    </div>
    <svg v-else id="vue-svg" :viewBox="viewBox">
      <g class="links">
        <tapestry-link
          v-for="link in links"
          :key="`${link.source}-${link.target}`"
          :source="nodes[link.source]"
          :target="nodes[link.target]"
        ></tapestry-link>
      </g>
      <g v-if="!dragSelectEnabled || dragSelectReady" class="nodes">
        <tapestry-node
          v-for="(node, id) in nodes"
          :key="id"
          :node="node"
          class="node"
          :class="{ selectable: true }"
          :data-id="id"
          :root="id == selectedId"
          @dragend="updateViewBox"
          @mouseover="handleMouseover(id)"
          @mouseleave="activeNode = null"
          @mounted="dragSelectEnabled ? updateSelectableNodes(node) : null"
        ></tapestry-node>
      </g>
      <locked-tooltip
        v-if="activeNode"
        :node="nodes[activeNode]"
        :viewBox="viewBox"
      ></locked-tooltip>
    </svg>
  </main>
</template>

<script>
import DragSelectModular from "@/utils/dragSelectModular"
import { mapMutations, mapState } from "vuex"
import TapestryNode from "./TapestryNode"
import TapestryLink from "./TapestryLink"
import RootNodeButton from "./RootNodeButton"
import LockedTooltip from "./LockedTooltip"
import Helpers from "@/utils/Helpers"
import { names } from "@/config/routes"
import * as wp from "@/services/wp"

export default {
  components: {
    TapestryNode,
    TapestryLink,
    RootNodeButton,
    LockedTooltip,
  },
  props: {
    viewBox: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dragSelectReady: false,
      activeNode: null,
      uploadPDFClicked: false,
      writePromptClicked: false,
      createYourselfClicked: false,
    }
  },
  computed: {
    ...mapState(["nodes", "links", "selection", "settings", "rootId"]),
    background() {
      return this.settings.backgroundUrl
    },
    canEdit() {
      return wp.canEditTapestry()
    },
    empty() {
      return Object.keys(this.nodes).length === 0
    },
    selectedId() {
      return Number(this.$route.params.nodeId)
    },
    dragSelectEnabled() {
      return !Helpers.isTouchEnabledDevice()
    },
    editableNodes() {
      return this.nodes.length
        ? this.nodes.filter(node => this.nodeIsEditable(node))
        : this.nodes
    },
  },
  watch: {
    background: {
      immediate: true,
      handler(background) {
        document.body.style.backgroundImage = background ? `url(${background})` : ""
      },
    },
    selectedId: {
      immediate: true,
      handler(nodeId) {
        if (this.$route.name === names.APP && !this.nodes.hasOwnProperty(nodeId)) {
          this.$router.replace(
            Object.keys(this.nodes).length === 0
              ? { path: "/", query: this.$route.query }
              : {
                  name: names.APP,
                  params: { nodeId: this.rootId },
                  query: this.$route.query,
                }
          )
        }
      },
    },
  },
  mounted() {
    if (this.dragSelectEnabled) {
      DragSelectModular.initializeDragSelect(this.$refs.app, this, this.nodes)
    }
    this.updateViewBox()
    this.dragSelectReady = true
  },
  methods: {
    ...mapMutations(["select", "unselect", "clearSelection"]),
    addRootNode() {
      this.$root.$emit("add-node", null)
    },

    updateSelectableNodes() {
      DragSelectModular.updateSelectableNodes()
    },
    nodeIsEditable(node) {
      return wp.isLoggedIn() && Helpers.hasPermission(node, "edit")
    },
    updateViewBox() {
      this.$parent.updateViewBox()
    },
    handleMouseover(id) {
      const node = this.nodes[id]
      if (
        !node.accessible &&
        node.nodeType !== "grandchild" &&
        node.nodeType !== ""
      ) {
        this.activeNode = id
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#tapestry {
  .empty-message {
    margin: 30vh auto;
  }
  svg {
    position: relative;
  }
}
</style>