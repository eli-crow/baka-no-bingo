<script setup lang="ts">
import AvatarSelector from '@/components/AvatarSelector.vue';
import Button from '@/components/Button.vue';
import Icon, { x } from '@/components/Icon';
import TextInput from '@/components/TextInput.vue';
import Tile from '@/components/Tile.vue';
import { useClientGameState } from '@/composables/createClientGameState';
import { PlayerOptions, ROOM_CODE_PATTERN } from '@shared';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const game = useClientGameState();
const router = useRouter();

const code = ref('');
const options = reactive<PlayerOptions>({});

function join() {
  game.join(code.value, options).then(() => {
    router.push('/game');
  });
}
</script>

<template>
  <div class="Join">
    <h1 class="title">Join</h1>
    <router-link class="close" to="/">
      <Icon :icon="x" />
    </router-link>
    <div class="content">
      <Tile color="blue">
        <form @submit.prevent="join" action="">
          <div class="code tile tile--blue">
            Room code:
            <TextInput
              maxlength="4"
              v-model="code"
              required
              :pattern="ROOM_CODE_PATTERN"
              validation-message="Room code must be 4 letters or numbers"
            />
          </div>
          <div class="player-info tile tile--blue">
            <AvatarSelector v-model="options.avatar" />
            <label>
              <span>Your Name: </span>
              <TextInput type="text" v-model.lazy.trim="options.name" />
            </label>
          </div>

          <Button type="submit" class="join tile tile--yellow">Join</Button>
        </form>
      </Tile>
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
