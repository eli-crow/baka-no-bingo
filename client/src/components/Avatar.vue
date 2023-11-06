<script setup lang="ts">
import cal from '@/assets/avatars/cal.svg';
import cat from '@/assets/avatars/cat.svg';
import ein from '@/assets/avatars/ein.svg';
import nina from '@/assets/avatars/nina.svg';
import { AvatarName } from '@shared';
import { computed } from 'vue';

const AVATARS: Record<AvatarName, { src: string }> = {
  cal: { src: cal },
  cat: { src: cat },
  ein: { src: ein },
  nina: { src: nina },
};

const props = defineProps<{
  avatar: AvatarName;
}>();

const src = computed(() => AVATARS[props.avatar].src);
</script>

<template>
  <img class="avatar-image" draggable="false" :src="src" />
</template>
