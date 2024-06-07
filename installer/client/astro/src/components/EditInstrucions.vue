<script setup lang="ts">
import EditSvg from './EditSvg.vue'
import {ref} from "vue";
import markdownIt from 'markdown-it'
import InfoSvg from "./InfoSvg.vue";

const md  = markdownIt()
const props = defineProps({
  markdownContent:String,
  models:Array<string>
})
const isEdit = ref(true)
let systemInstruction = props.markdownContent

let result = ref(md.render(systemInstruction!))
const onChange = (event:Event)=>{
  isEdit.value =false
  systemInstruction = (event.target as HTMLTextAreaElement)?.value
  result.value = md.render(systemInstruction!)
}
</script>

<template>
  <form class="w-full min-w-[40rem] flex flex-col gap-6" method="post" >
  <label class="form-control w-full max-w-xs ">
        <span class="label">GPT Model (Required)
            <InfoSvg data="All GPT models from older to newer"/>
        </span>
    <select class="select select-bordered" required name="model">
      <option disabled selected></option>

      <option v-for="model in models">{{model}}</option>

    </select>
  </label>
  <label class="form-control">
    <span class="label">
    <span>System instruction: (optional)</span>
        <button class="btn bg-red-800" @click="(e)=>{
    e.preventDefault()
    isEdit=!isEdit}">
          <span v-if="isEdit">Show Markdown</span>
          <span v-else>Hide Markdown</span>
  </button>
    </span>
    <textarea class="textarea textarea-bordered" v-html="systemInstruction"
              name="instruction"
              @change="onChange($event)"
              rows="10"
              :value="systemInstruction"
    ></textarea>
  </label>
<div  v-if="!isEdit" v-html="result" class="prose mt-4 prose-h1:text-red-500 prose-h2:text-red-500 prose-h3:text-red-500 "></div>
  <label class="form-control">
            <span class="label">
                <span>Prompt: (Required)</span>
                <InfoSvg data="The prompt to send for the model"/>

            </span>
    <textarea class="textarea textarea-bordered" name="prompt" rows="10" required></textarea>
  </label>
  <button class="btn bg-red-700 m-auto mt-4">submit</button>
  </form>
</template>