<script setup lang="ts">
import {ref, } from "vue";
import markdownIt from 'markdown-it'
import InfoSvg from "./InfoSvg.vue";
import type {ChatCompletionStream} from "openai/lib/ChatCompletionStream";


const md = markdownIt()
const props = defineProps({
  markdownContent: String,
  models: Array<string>
})
let model:string
let prompt:string
let response= ref<string>('')

const dialog = ref(true)
let systemInstruction = props.markdownContent
let result = ref(md.render(systemInstruction!))
let loading = ref(false)

const onChange = (event: Event) => {
  systemInstruction = (event.target as HTMLTextAreaElement)?.value
  result.value = md.render(systemInstruction!)
}
const modelToggle = (event: Event) => {
  event.preventDefault()
  const element = dialog.value as unknown as HTMLDialogElement
  element.showModal()
}
const submit = async (event: Event) => {
  event.preventDefault();
  if (model && prompt) {
    try {
      const res = await fetch('/testEndpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }] })
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        response.value += decoder.decode(value, { stream: true });
      console.log(response.value)
      }
      loading.value = false;
    } catch (error) {
      console.error(error);
      loading.value = false;

    }
  } else{
    alert("Please fill in the prompt and model")
  }
};

</script>

<template>
  <form class="w-full min-w-[40rem] flex flex-col gap-6">
    <label class="form-control w-full max-w-xs ">
        <span class="label">GPT Model (Required)
            <InfoSvg data="All GPT models from older to newer"/>
        </span>
      <select class="select select-bordered" required v-model="model">
        <option disabled selected></option>
        <option v-for="model in models">{{ model }}</option>
      </select>
    </label>
    <span class="label">
    <span>System instruction: (optional)</span>
    <span class="w-fit">
          <button class="btn text-white hover:text-black  bg-red-800"
                  @click="modelToggle($event)">
          <span>Show Markdown</span>

  </button>
    </span>
    </span>
    <label class="form-control">

    <textarea class="textarea textarea-bordered"
              rows="10"
              @input="onChange($event)"
              :value="systemInstruction"
    ></textarea>
    </label>

    <label class="form-control">
            <span class="label">
                <span>Prompt: (Required)</span>
                <InfoSvg data="The prompt to send for the model"/>

            </span>
      <textarea
          class="textarea textarea-bordered"
          v-model="prompt"
          rows="10"
          required></textarea>
    </label>
    <button :disabled="loading" @click="submit($event)" class="btn bg-red-700 m-auto mt-4">submit
    </button>
  </form>
  <dialog ref="dialog" class="modal">
    <div class="modal-box">
      <div v-html="result"
           class="prose  mt-4 prose-h1:text-red-500 prose-h2:text-red-500 prose-h3:text-red-500 "></div>

    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
  <div class="prose" v-html="response">

  </div>
</template>