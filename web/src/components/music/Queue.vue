<template>
  <div v-if="store.queue.length" class="others">
    <h3>Queue : </h3>
    <div v-for="item in store.queue" :key="item.id" :id="item.trackId">
      <img :src="item.album.cover.big" width="50" alt="Album cover"/>
      <p>- {{ item.title }}</p>
    </div>
  </div>
</template>

<script>
import {useStore} from '@/store/main'

export default {
  name: "Queue",
  setup() {
    const store = useStore()
    return {store}
  },
}
</script>

<style scoped lang="scss">
@import '../../assets/style/components/queue.scss';
</style>
