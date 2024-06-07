<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
const add = () => count.value++;
const subtract = () => count.value--;
const edit = ref(false);
function toggle(){
  edit.value= !edit.value
  console.log(edit.value)

}
console.log(edit.value)
</script>

<template>
	<div class="counter">
		<button @click="toggle">-</button>
		<pre>{{ edit }}</pre>
		<button @click="toggle">+</button>
	</div>
	<div class="counter-message">
		<slot />
	</div>
</template>

<style>
.counter {
	display: grid;
	font-size: 2em;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	margin-top: 2em;
	place-items: center;
}

.counter-message {
	text-align: center;
}
</style>
