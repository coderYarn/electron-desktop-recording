<template>
  <div class="box" @click="exitDia" v-if="show">
    <div class="recordBox">
      <div class="imgBox" :key="item.name" v-for="item in sourceList">
        <img @click="handlerClick(item)" :src="item.url" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, toRefs } from 'vue'

export default defineComponent({
  props: {
    sourceList: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['recrodWin', 'update:show'],
  setup (props, { emit }) {
    const { sourceList: list } = toRefs(props)
    const handlerClick = (item) => {
      emit('recrodWin', { ...item, show: false })
    }
    const exitDia = () => {
      emit('exitDia', false)
    }
    return {
      list,
      handlerClick,
      exitDia
    }
  }
})
</script>
<style>
.box {
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.recordBox {
  position: absolute;
  top: 50%;
  left: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  padding: 10px;
  min-width: 10vw;
  min-height: 10vh;
  max-height: 60vh;
  max-width: 70vw;
  text-align: center;
  box-shadow: 1px 1px 15px #fff;
  border-radius: 10px;
  overflow-y: scroll;
}

.imgBox {
  display: inline-block;
  box-sizing: border-box;
  padding: 10px;
  width: 20vw;
}
</style>
