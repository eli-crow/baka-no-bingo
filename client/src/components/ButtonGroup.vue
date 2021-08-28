<template>
  <div class="ButtonGroup">
    <slot />
  </div>
</template>

<style scoped>
.ButtonGroup {
    display: flex;
    flex-wrap: wrap; 
    justify-content: center;
    margin: -6px;
}
.ButtonGroup:not(:first-child) {
    margin-top: 16px;
}
</style>

<style>
.ButtonGroup > .Button {
    flex: 0 0 max-content;
    margin: 6px;
}
</style>
