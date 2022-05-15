<template>
  <div class="box">
    <div v-if="show">
      <img @click="handlerClick(item)" :src="item.url" :key="item.name" v-for="item in sourceList" alt="" />
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
  emits: ['recrodWin'],
  setup (props, { emit }) {
    const { sourceList: list } = toRefs(props)
    const handlerClick = (item) => {
      console.log(111)
      emit('recrodWin', { ...item, show: false })
    }
    return {
      list,
      handlerClick
    }
  }
})
</script>
<style>
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  background: PINK;
}
</style>
