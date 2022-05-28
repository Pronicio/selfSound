<template>
  <section class="sec1">
    <img class="album_cover" :src="data.cover_big" alt="Album cover" width="250"/>
    <div class="infos">
      <p id="label">{{ data.label }}</p>
      <h1>{{ data.title }}</h1>
      <div class="artist">
        <img class="artist_picture" :src="data.artist.picture_small" alt="Artist picture" width="30"/>
        <h2>{{ data.artist.name }}</h2>
      </div>
      <p> {{ data.nb_tracks }} tracks - {{ secondsToString(data.duration, true) }} - {{ data.release_date }}</p>
      <div class="controls">
        <button id="listen"><div class="logo_play"></div>Écouter</button>
        <button id="like"></button>
      </div>
    </div>
  </section>
  <section class="sec2">
    <h2>Tracks : </h2>
    <div class="tracks">
      <div class="track" v-for="(item, index) in data.tracks.data" key="item.id" :id="item.id">
        <img :src="data.cover_small" alt="Album cover" width="50"/>
        <p>{{ index + 1 }}. {{ item.title }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { secondsToString } from '@/api'

export default {
  name: "Album.vue",
  data: function () {
    return {
      id: this.$route.params.query,
      data: {
        artist: {
          picture_small: null
        }
      }
    }
  },
  created: function () {
    if (this.$route.params.query) {
      this.getData()
    } else {
      this.$router.push('/')
    }
  },
  methods: {
    getData: async function () {
      let req = await axios({
        method: 'post',
        url: `http://localhost:9000/standard/album`,
        data: {
          id: this.id
        }
      })

      this.data = req.data;
      console.log(this.data);
    }
  },
  setup() {
    return {
      secondsToString
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/style/pages/elements/album.scss';
</style>
