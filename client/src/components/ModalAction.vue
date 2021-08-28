<script setup>
import Icon, {x} from './Icon'

const props = defineProps({
  title: {
    type: String,
    default: null
    },
  description: {
    type: String,
    default: null
    },
  icon: {
    type: String,
    default: null
    },
})

const emit = defineEmits(['close'])
</script>


<template>
  <section
    class="ModalAction"
    @click="$emit('close')"
  >
    <div
      class="content"
      @click.stop
    >
      <header class="header">
        <Icon
          v-if="icon"
          class="icon"
          :icon="icon"
        />
        <div class="header-text">
          <p class="title">
            {{ props.title }}
          </p>
          <p class="description">
            {{ props.description }}
          </p>
        </div>
        <Icon
          class="x"
          :icon="x"
          @click="emit('close')"
        />
      </header>
      <div class="slot-content">
        <slot />
      </div>
    </div>
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
    --border-scale: 0.75;
    --tile-padding: 0px;
    /* 
	set min-width and -height to override default tile sizing behavior
	allowing consistently sized tiles.
	*/
	min-width: 0;
	min-height: 0;
    width: 20rem;
    max-width: 100%;
	position: relative;
    border-image-source: url('../assets/images/tile-white.svg');
	border-image-slice: 36% 36% 50% 36% fill;
	border-image-width: calc(var(--border-scale) * 36px) calc(var(--border-scale) * 36px) calc(var(--border-scale) * 50px) calc(var(--border-scale) * 36px);
	border-image-repeat: stretch;
	border-image-outset: 0px 0px calc(var(--border-scale) * 14.88px) 0px;
	border-style: solid;
	padding: var(--tile-padding);
	line-height: 1.15;
	touch-action: manipulation;
	-webkit-tap-highlight-color: rgba(0,0,0,0);
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
