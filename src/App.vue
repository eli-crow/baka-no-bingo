<template>
  <div class="App" id="app">
    <transition name="wipe">
      <router-view class="view"/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  :root {
    --white: hsl(0, 0%, 100%);
    --black: hsl(0, 0%, 5%);
    --gray: hsl(0, 0%, 67%);
    --gray-light: hsl(0, 0%, 83%);
    --gray-lightest: hsl(0, 0%, 95%);
    --blue: hsl(204, 100%, 50%);
    --blue-dark: hsl(212, 100%, 50%);
    --blue-light: hsl(204, 100%, 78%);
    --red: hsl(0, 100%, 64%);
    --red-dark: hsl(0, 71%, 51%);
    --green: hsl(146, 97%, 35%);
    --green-light: hsl(146, 90%, 44%);
    --yellow: hsl(52, 100%, 50%);
    --yellow-dark: hsl(46, 100%, 50%);
    --yellow-light: hsl(54, 100%, 85%);

    --color-text-dark: var(--black);
    --color-text-default: hsl(0, 0%, 13%);
    --color-text-light: hsl(0, 0%, 42%);

    --font-family-hiragino: "Hiragino Sans", "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
    --font-family-noto: "Noto Sans", "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
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
  }

  .wipe-enter-active,
  .wipe-leave-active {
    transition: .125s linear;
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
}
.view {
  flex: 1 0 auto;
}
</style>