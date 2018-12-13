<template>
  <div id="app">
    <transition name="wipe">
      <router-view/>
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
    --color-theme-white: hsl(0, 0%, 100%);
    --color-theme-black: hsl(0, 0%, 5%);
    --color-theme-gray: hsl(0, 0%, 67%);
    --color-theme-gray-light: hsl(0, 0%, 83%);
    --color-theme-gray-lightest: hsl(0, 0%, 95%);
    --color-theme-blue: hsl(204, 100%, 50%);
    --color-theme-blue-dark: hsl(212, 100%, 50%);
    --color-theme-blue-light: hsl(204, 100%, 78%);
    --color-theme-red: hsl(0, 100%, 64%);
    --color-theme-red-dark: hsl(0, 71%, 51%);
    --color-theme-green: hsl(146, 97%, 35%);
    --color-theme-green-light: hsl(146, 90%, 44%);
    --color-theme-yellow: hsl(52, 100%, 50%);
    --color-theme-yellow-dark: hsl(46, 100%, 50%);
    --color-theme-yellow-light: hsl(54, 100%, 85%);

    --color-text-dark: var(--color-theme-black);
    --color-text-default: hsl(0, 0%, 13%);
    --color-text-light: hsl(0, 0%, 42%);

    --font-family-hiragino: "Hiragino Sans", "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
    --font-family-noto: "Noto Sans", "Hiragino Kaku Gothic Pro", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
    --font-title: 800 1.5rem / 1.2 var(--font-family-noto);
    --font-default: 400 1rem / 1.3 var(--font-family-noto);

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
  }

  body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    font: var(--font-default);
    color: var(--color-text-default);
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
