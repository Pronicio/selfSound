<template>
  <div v-if="store.queue.length" class="others">
    <h3>Queue : </h3>
    <div v-for="item in store.queue" :key="item.id" :id="item.trackId" class="track" @click="play(item)">
      <img :src="item.album.cover.big" width="50" alt="Album cover" loading="lazy"/>
      <p>- {{ item.title }}</p>
    </div>
  </div>
</template>

<script>
import { useStore } from '@/store/main'
import { getYoutubeVideoFromProvider } from "../../api";

export default {
  name: "Queue",
  methods: {
    play: async function (data) {
      let track = data;

      if (!data.videoId) track = await getYoutubeVideoFromProvider(data);

      //Store music locally for later.
      this.store.currentMusic = track;
      localStorage.setItem('track', JSON.stringify(track));

      //Announces the arrival of the music.
      this.eventBus.emit('play', track)
    }
  },
  setup() {
    const store = useStore()
    return { store }
  },
}
</script>

<style scoped lang="scss">
@import '../../assets/style/components/queue.scss';
</style>
