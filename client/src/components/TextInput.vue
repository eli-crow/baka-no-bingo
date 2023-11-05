<script setup lang="ts">
const props = defineProps<{
  validationMessage?: string;
  modelValue?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <input
    type="text"
    class="TextInput"
    :value="props.modelValue"
    @invalid="
      validationMessage
        ? ($event.currentTarget as HTMLInputElement).setCustomValidity(
            validationMessage
          )
        : undefined
    "
    @input="
      if (validationMessage)
        ($event.currentTarget as HTMLInputElement).setCustomValidity('');
      emit(
        'update:modelValue',
        ($event.currentTarget as HTMLInputElement).value
      );
    "
  />
</template>

<style scoped>
.TextInput {
  --inner-shadow: inset 3px 4px 0 0 #00000036;
  --var-focus-outline: 0 0 0 2px rgba(32, 102, 222, 0.287);
  --border-color: black;

  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 8px 10px;
  font: inherit;
  color: #000;
  box-shadow: var(--inner-shadow);
}

.TextInput:focus {
  outline: none;
  box-shadow: var(--inner-shadow), var(--var-focus-outline);
  --border-color: #2066de;
}
</style>
