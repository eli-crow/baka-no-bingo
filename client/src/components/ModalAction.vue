<script setup>
import Icon, {x} from './Icon'
import Tile from './Tile.vue'

const props = defineProps({
  title: {
    type: String,
    default: null
    },
  description: {
    type: String,
    default: null
    }
})

const emit = defineEmits(['close'])
</script>


<template>
  <section class="ModalAction" role="dialog" @click="$emit('close')">
    <Tile class="content" @click.stop>
      <header class="header">
        <Icon v-if="icon" class="icon" :icon="icon" />
        <div class="header-text">
          <p class="title">{{ props.title }}</p>
          <p class="description">{{ props.description }}</p>
        </div>
        <button @click="emit('close')"><Icon class="x" :icon="x" /></button>
      </header>
      <div class="slot-content">
        <slot />
      </div>
    </Tile>
  </section>
</template>


<style scoped>
.ModalAction {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000000;
    width: 100%;
    height: 100%;
    display: flex;
    padding: 12px;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.6);
}

.content {
  text-align: left;
}

.header {
    display: flex;
    border-bottom: solid 1px var(--white);
    padding: 16px 16px;
}

.icon {
    width: 36px;
    height: 36px;
    align-self: center;
    margin-right: 8px;
}

.header-text {
    flex: 1 1 auto;
}
.title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
}
.description {
    margin: 0;
    font-size: 14px;
}

.x {
    width: 2rem;
    height: 2rem;
    padding: 0.5rem;
    border-radius: 99999px;
    background-color: var(--gray-light);
}

.slot-content {
    padding: 16px 16px;
}
</style>
