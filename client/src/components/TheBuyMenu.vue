<script setup lang="ts">
import { useGameStateMachine } from '@/composables/createGameStateMachine';

const game = useGameStateMachine();
</script>

<template>
  <div class="TheBuyMenu">
    <!-- <img class="icon" src="../assets/icons/spell-replace.svg" />
    <div class="title">Tap a tile to replace it. </div>
    <Icon class="x" :icon="x" @click="game.discardTile()" />
    <div class="body">
      <Tile :text="game.boughtTile.text" />
      <div class="button-group">
        <button
          class="button"
          style="--color: var(--green-light)"
          @click="game.spells.buy()"
        >
          Try another
          <span class="button-cost">-5</span>
        </button>
        <button
          class="button"
          style="--color: var(--red)"
          @click="game.discardTile()"
        >
          Discard
        </button>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.TheBuyMenu {
  display: grid;
  grid-template-columns: 2.5rem auto 2rem;
  grid-template-areas:
    'icon title  x'
    'body body body';
  align-items: center;
  padding: 1rem;
  background-color: var(--green);
}

.icon {
  grid-area: icon;
}

.title {
  grid-area: title;
  font: var(--font-title);
  color: var(--white);
}

.x {
  grid-area: x;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0.45rem;
  background-color: rgba(0, 0, 0, 0.13);
  border-radius: 99999px;
}

.body {
  grid-area: body;
  display: flex;
  align-items: center;
  padding: 1rem 0;
}

.button-group {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}

.button {
  display: flex;
  height: 3rem;
  align-items: center;
  justify-content: space-between;
  background: var(--color);
  border-top-right-radius: var(--radius-small);
  border-bottom-right-radius: var(--radius-small);
  box-shadow: 0 0.25rem 0 0 rgba(0, 0, 0, 0.07);
  font-weight: 700;
  color: var(--white);
  padding-left: 1rem;
  padding-right: 1rem;
}
.button:not(:last-child) {
  margin-bottom: 0.5rem;
}
</style>
../composables/game
