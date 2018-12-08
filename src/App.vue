<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  :root {
    --color-theme-gray: hsl(0, 0%, 67%);
    --color-theme-gray-light: hsl(0, 0%, 97%);
    --color-theme-blue: hsl(204, 100%, 50%);
    --color-theme-blue-light: hsl(204, 100%, 94%);
    --color-theme-red: hsl(0, 100%, 64%);
    --color-theme-green: hsl(146, 97%, 35%);
    --color-theme-yellow: hsl(54, 100%, 50%);
    --color-theme-yellow-light: hsl(54, 100%, 90%);

    --color-text-dark: hsl(0, 0%, 5%);
    --color-text-default: hsl(0, 0%, 13%);

    --font-family-hiragino: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro",Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
    --font-family-hiragino-bold: "Hiragino Kaku Gothic StdN", Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
    --font-title: var(--font-family-hiragino-bold);

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
    font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro",Osaka, "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
    color: var(--color-text-default);
  }
</style>
