<template>
  <ClientOnly>
    <div class="code-card">
      <div class="card-header">
        <div>{{ title }}</div>
      </div>

      <slot></slot>

      <div class="copy-button">
        <button v-copy="origin" class="primary-button" text>复制代码</button>
        <button @click="toggle" class="primary-button" text>
          源码
          <span class="icon">
            <ArrowUp v-if="isExpand" />
            <ArrowDown v-else />
          </span>
        </button>
      </div>

      <div
        class="language-html line-numbers-mode"
        :style="{
          height: isExpand ? 'auto' : 0
        }"
      >
        <article v-html="html"></article>
        <div class="line-numbers-wrapper">
          <template v-for="item in total" :key="item">
            <span class="line-number">
              {{ item }}
            </span>
            <br />
          </template>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import ArrowDown from './ArrowDown.vue'
import ArrowUp from './ArrowUp.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  }
})

const origin = ref('')
const html = ref('')
const total = ref(0)

const isExpand = ref(false)

const htmlCode = inject('components-raw') as any

const getCode = () => {
  const key = Object.keys(htmlCode).find(item => item.includes(props.fileName))!
  return htmlCode[key]
}

const getFile = () => {
  try {
    const data = getCode()
    origin.value = data
    const tem = data.split('\n')
    html.value = `<pre><code id='customCode'>${
      window.hljs.highlightAuto(data, ['xml']).value
    }</code></pre>`
    total.value = tem.length
  } catch (error) {}
}

getFile()

const toggle = () => {
  isExpand.value = !isExpand.value
}
</script>

<style lang="scss" scoped>
.code-card {
  border-radius: 4px;
  border: 1px solid #e4e7fd;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3;
  padding: 14px;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .copy-button {
    text-align: right;
    border: 1px solid #dcdfe6;
    padding: 6px;
    .icon {
      fill: #fff;
      margin-left: 2px;
      width: 16px;
      height: 16px;
    }
  }
}
</style>
