<template>
  <section class="sec1">
    <object class="cover lazy" :data="data.picture_big" type="image/png" width="250"></object>
    <div class="infos">
      <h1 style="margin: 0">{{ data.title }}</h1>
      <div class="artist">
        <h2 v-if="data.creator">{{ data.creator.name }}</h2>
      </div>
      <p> {{ data.nb_tracks }} track(s) - {{ secondsToString(data.duration, true) }}</p>
      <div class="controls">
        <button id="listen" @click="playFromProvider(data.tracks.data[0])">
          <div class="logo_play"></div>
          Écouter
        </button>
        <button id="like"></button>
      </div>
    </div>
  </section>
  <section class="sec2">
    <h2>Tracks : </h2>
    <div class="tracks">
      <div v-if="data.tracks" class="track" v-for="(item, index) in data.tracks.data" :key="item.id" :id="item.id"
           @click="playFromProvider(item)">
        <div class="details">
          <img :src="item.album.cover_small" alt="Album cover" width="50" loading="lazy"/>
          <p>{{ index + 1 }}. {{ item.title }}</p>
        </div>
        <div class="right">
          <div id="like_music"></div>
          <div id="menu"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import {secondsToString} from '@/api'
import {useStore} from '@/store/main'
import {getYoutubeVideoFromProvider} from "../../api";

export default {
  name: "Playlist",
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
  beforeMount: function () {
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
        url: `${import.meta.env.VITE_BACK}/standard/playlist`,
        data: {
          id: this.id
        }
      })

      this.data = req.data;
      document.title = `SelfSound - ${this.data.title}`
    },
    playFromProvider: async function (music) {
      let track = await getYoutubeVideoFromProvider(music);

      //Store music locally for later.
      this.store.currentMusic = track;
      localStorage.setItem('track', JSON.stringify(track));

      //Announces the arrival of the music.
      this.eventBus.emit('play', track)

      // Queue up the other music from the album.
      this.store.queue = [];
      this.store.cache_queue = [];
      this.store.shuffle_cache_queue = [];
      this.data.tracks.data.forEach(el => {
        if (music.id !== el.id) {
          track = {
            trackId: el.id,
            videoId: null,
            title: el.title_short ? el.title_short : el.title,
            artist: {
              id: el.artist.id,
              name: el.artist.name,
            },
            album: {
              id: this.data.id,
              cover: {
                big: el.album.cover_big,
                xl: el.album.cover_xl,
              },
            }
          };
          this.store.queue.push(track)
        }
      })

      //If the shuffle option is enabled then execute the mix.
      if (this.store.controls.shuffle) {
        this.store.controls.shuffle = false;
        this.eventBus.emit('control', 'shuffle')
      }
    }
  },
  setup() {
    const store = useStore()

    return {
      secondsToString,
      store
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/style/pages/elements/album.scss';
</style>
