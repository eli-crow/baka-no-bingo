<script setup lang="ts">
import AvatarSelector from '@/components/AvatarSelector.vue';
import { useGameStateMachine } from '@/composables/createGameStateMachine';
import router from '@/routes';
import { PlayerDataOptions } from '@shared';
import { computed, reactive, ref, watchEffect } from 'vue';

const game = useGameStateMachine();

const options = reactive<PlayerDataOptions>({});

const code = ref('');
const codeIsValid = computed(() => code.value.length === 4);

function join() {
  if (codeIsValid.value) {
    game.join(code.value, options);
  }
}

watchEffect(() => {
  if (game.state.type === 'joined') {
    router.push('/game');
  }
});
</script>

<template>
  <div class="Join">
    <h1 class="title">Join</h1>
    <router-link class="close" to="/">
      <Icon icon="x" />
    </router-link>
    <div class="content">
      <div class="code tile tile--blue">
        Room code:
        <input v-model="code" type="text" maxlength="4" />
      </div>
      <div class="player-info tile tile--blue">
        <AvatarSelector v-model="options.avatar" />
        <input v-model.lazy.trim="options.name" type="text" />
      </div>

      <button class="join tile tile--yellow" @click="join">Join</button>
    </div>
  </div>
</template>

<style scoped>
.Join {
  --shadow-color: var(--blue-dark);
  background-color: var(--blue);
  color: var(--white);
  display: grid;
  grid-template:
    'title close' 3rem
    'content content' 1fr
    / 1fr 3rem;
}

.title {
  grid-area: title;
  margin: 0;
  align-self: center;
  justify-self: start;
  padding-left: 1rem;
  padding-right: 1rem;
}

.close {
  grid-area: close;
  display: flex;
  align-items: center;
  justify-self: center;
  color: inherit;
}

.content {
  grid-area: content;
  padding-left: 1rem;
  padding-right: 1rem;
}

.player-info {
  padding: 1rem;
}

.join {
  color: var(--black);
}
</style>
../composables/game
