<!-- src/components/MinMaxInput.vue -->
<template>
  <input ref="input"
         v-bind:value="value"
         v-on:change="validateValue($event.target.value)"
         v-on:blur="validateValue($event.target.value)"
         class="w-full p-2 border rounded"/>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';

const props = defineProps<{
  value: number,
  min: number,
  max: number
}>();

const input = ref<HTMLInputElement>();

const validateValue = (value: string) => {
  let newVal = parseInt(value);

  if (newVal < props.min) {
    newVal = props.min;
  }

  if (newVal > props.max) {
    newVal = props.max;
  }

  if (input.value) {
    input.value.value = newVal.toString();
  }

  // Emit event to parent component
  input.value?.dispatchEvent(
      new CustomEvent('input', {
        detail: newVal,
        composed: true,
        bubbles: true
      })
  );
};
</script>
