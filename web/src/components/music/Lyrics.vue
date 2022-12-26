<template>
  <div class="lyrics">
    <div class="loader" v-if="!lyrics[0]">

    </div>
    <p v-for="item in lyrics" :key="item">
      {{ item }}
    </p>
  </div>
</template>

<script>
import axios from "axios";
import { useStore } from "@/store/main";

export default {
  name: "Lyrics",
  data: function () {
    return {
      lyrics: this.store.currentMusic.lyrics
    }
  },
  mounted() {
    if (!this.store.currentMusic.lyrics[0]) this.search(this.store.currentMusic.title, this.store.currentMusic.artist.name)

    this.eventBus.on('play', (data) => {
      this.lyrics = []
      this.search(this.store.currentMusic.title, this.store.currentMusic.artist.name)
    })
  },
  methods: {
    async search(title, artist) {
      const req = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BACK}/lyrics/search`,
        data: {
          query: title,
          artist: artist
        }
      }).catch(e => {
        this.lyrics = ["No lyrics found.."]
        return this.store.currentMusic.lyrics = this.lyrics;
      })

      this.lyrics = req.data.lyrics.split('\n');
      this.store.currentMusic.lyrics = this.lyrics;
    }
  },
  setup() {
    const store = useStore()
    return { store }
  },
}
</script>

<style scoped lang="scss">
@import '../../assets/style/components/lyrics.scss';
</style>
