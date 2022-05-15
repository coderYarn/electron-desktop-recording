<template>
  <div>
    <header v-mouse-drag="handleDrag">
      <div class="logo">Logo</div>
      <div class="muen">
        <div class="item" @click="handlerMinimize">隐藏</div>
        <div class="item" @click="handlerMaximize" v-if="isMax">最大化</div>
        <div class="item" @click="handlerRestore" v-else>回复</div>
        <div class="item" @click="handlerClose">关闭</div>
      </div>
    </header>
    <slot></slot>
  </div>
</template>

<script>

import { ref, defineComponent } from 'vue'
const { ipcRenderer } = window.require('electron')
export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Layer',

  setup (props) {
    const isMax = ref(true)
    const handleDrag = (pos) => {
      ipcRenderer.send('move-main', pos)
    }
    const handlerMinimize = () => {
      console.log('mainwin-maxize')
      ipcRenderer.send('mainwin-minize')
    }
    const handlerMaximize = () => {
      if (isMax.value) {
        isMax.value = false
        ipcRenderer.send('mainwin-maxize')
      } else {
        isMax.value = false
        ipcRenderer.send('mainwin-restore')
      }
    }
    const handlerClose = () => {
      ipcRenderer.send('mainwin-close')
    }
    const handlerRestore = () => {
      isMax.value = true
      ipcRenderer.send('mainwin-restore')
    }
    return {
      handleDrag,
      handlerMinimize,
      handlerMaximize,
      handlerClose,
      handlerRestore,
      isMax
    }
  }
})
</script>

<style scope>
header {
  height: 50px;
  background: #000;
  color: #fff;
  display: flex;
  padding: 0 20px;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
}
.muen {
  display: flex;
}
.item {
  margin-right: 10px;
}
</style>
