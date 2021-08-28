<script setup>
import { computed } from "@vue/reactivity";
import game from './store/game';

const ambientColorStyle = computed(() => {
  return {
    '--ambient': `var(--${game.boughtTile ? 'green' :
      game.sellablePatterns.length ? 'blue' :
        'yellow'
      })`,
    '--ambient-dark': `var(--${game.boughtTile ? 'green-dark' :
      game.sellablePatterns.length ? 'blue-dark' :
        'yellow-dark'
      })`,
  };
})
</script>

<template>
  <div class="App" id="app" :style="ambientColorStyle">
    <transition name="wipe">
      <router-view class="view" />
    </transition>
  </div>
</template>

<style>
:root {
  --white: hsl(0, 0%, 100%);
  --black: hsl(0, 0%, 0%);
  --gray: hsl(0, 0%, 67%);
  --gray-dark: hsl(0, 0%, 54%);
  --gray-light: hsl(0, 0%, 83%);
  --gray-lightest: hsl(0, 0%, 95%);
  --blue-gray-light: hsl(219, 33%, 92%);
  --blue: hsl(204, 100%, 51%);
  --blue-dark: hsl(224, 100%, 55%);
  --blue-light: hsl(195, 99%, 89%);
  --red: HSL(0, 100%, 60%);
  --red-dark: HSL(350, 100%, 44%);
  --red-light: hsl(0, 100%, 73%);
  --green: hsl(146, 97%, 35%);
  --green-dark: hsl(140, 100%, 26%);
  --green-light: hsl(146, 90%, 44%);
  --yellow: hsl(49, 100%, 50%);
  --yellow-dark: hsl(27, 97%, 48%);
  --yellow-light: hsl(54, 100%, 78%);
  --purple: hsl(269, 100%, 59%);
  --purple-dark: hsl(275, 83%, 35%);
  --purple-light: hsl(265, 96%, 68%);

  --ambient: var(--yellow);
  --ambient-dark: var(--yellow-dark);

  --color-text-dark: var(--black);
  --color-text-default: var(--black);
  --color-text-light: hsl(0, 0%, 42%);

  --font-family-hiragino: "Hiragino Sans", "Hiragino Kaku Gothic Pro", Osaka,
    "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
  --font-family-noto: "Noto Sans", "Hiragino Kaku Gothic Pro", Osaka, "メイリオ",
    Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
  --font-title: 800 1.35rem / 1.2 var(--font-family-noto);
  --font-default: 400 1rem / 1.3 var(--font-family-noto);

  --radius-small: 6px;
  --radius-medium: 10px;

  --line-groove: solid 2px hsl(0, 0%, 98%);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  font: var(--font-default);
  color: var(--color-text-default);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.wipe-enter-active,
.wipe-leave-active {
  transition: 0.125s linear;
  transition-property: opacity, transform;
}

.wipe-leave-active {
  position: absolute;
  width: 100%;
}

.wipe-enter,
.wipe-leave-to {
  opacity: 0;
}
</style>



<style scoped>
.App {
  flex: 1 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--ambient);
}
.App::after {
  position: absolute;
  z-index: 1000;
  content: "";
  top: 1px;
  left: 1px;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), 50%, black);
  opacity: 0.25;
  mix-blend-mode: overlay;
  pointer-events: none;
}
.view {
  flex: 1 0 auto;
  padding-bottom: 1rem;
}
</style>