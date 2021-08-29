<script setup>
import { onMounted, reactive } from "@vue/runtime-core"
import game from '../store/game'

const state = reactive({
    show: false,
    right: true
})

onMounted(() => {
    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case '`':
                if (e.ctrlKey) {
                    state.show = !state.show
                    e.preventDefault()
                }
                break;
            case 'd':
              if (e.ctrlKey && state.show) {
                state.right = !state.right
                e.preventDefault()
              }
        }
    })
})
</script>



<template>
  <teleport to="body">
    <div
      v-if="state.show"
      class="DebugView"
      :data-right="state.right"
    >
      <pre><code>{{ JSON.stringify(game, null, '  ') }}</code></pre>
    </div>
  </teleport>
</template>



<style scoped>
.DebugView {
    position: fixed;
    font-size: 8px;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(12px);
    overflow: scroll;
    z-index: 10000;
    padding: 8px;
    font-family: 'Roboto Mono', monospace;
    color: white;
    border-radius: 12px;
}
[data-right="true"] {
    top: 4px;
    right: 4px;
    bottom: 4px;
    width: 300px;
}
[data-right="false"] {
    top: 4px;
    right: 4px;
    left: 4px;
    height: 400px;
}
</style>