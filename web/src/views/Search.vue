<template>
  <div class="search">

    <h3 v-if="searchResult.track.length"> Tracks : </h3>

    <div class="result">
      <div v-for="item in searchResult.track" :key="item.id" :id="item.id">
        <img :src="item.album.cover_medium" alt="Album cover" loading="lazy" @click="playFromProvider(item)"/>
        <h4>{{ cleanString(item.title_short) }}</h4>
        <p class="sub-text">{{ item.artist.name }}</p>
      </div>
    </div>

    <h3 v-if="searchResult.album.length"> Albums : </h3>

    <div class="result">
      <div v-for="item in searchResult.album" :key="item.id" :id="item.id">
        <img :src="item.cover_medium" alt="Album cover" loading="lazy"
             @click="this.$router.push({ name: 'Album', params: { query: item.id } })"/>
        <h4>{{ cleanString(item.title) }}</h4>
        <p class="sub-text">{{ item.artist.name }}</p>
      </div>
    </div>

    <h3 v-if="searchResult.artist.length"> Artists : </h3>

    <div class="result">
      <div v-for="item in searchResult.artist" :key="item.id" :id="item.id" class="artist_section">
        <img class="rounded_img" :src="item.picture_medium" alt="Artist picture" loading="lazy"/>
        <h5>{{ item.name }}</h5>
        <p class="sub-text">{{ toHumanString(item.nb_fan) }} fans</p>
      </div>
    </div>

    <h3 v-if="searchResult.playlist.length"> Playlists : </h3>

    <div class="result">
      <div v-for="item in searchResult.playlist" :key="item.id" :id="item.id">
        <img :src="item.picture_medium" alt="Playlist cover" loading="lazy"/>
        <h4>{{ cleanString(item.title) }}</h4>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { useStore } from '@/store/main'
import { toHumanString, cleanString } from "../api";

import { getYoutubeVideoFromProvider } from '../api'

export default {
  name: "Search",
  data: function () {
    return {
      searchInput: this.$route.params.query,
      searchResult: {
        track: [],
        album: [],
        artist: [],
        playlist: []
      }
    }
  },
  beforeMount: function () {
    if (this.$route.params.query) {
      this.search()
    } else {
      this.$router.push('/')
    }
  },
  mounted: function () {
    this.eventBus.on('onSearch', (data) => {
      this.searchInput = data;
      this.search();
    })

    document.title = 'SelfSound - Search'
  },
  methods: {
    search: async function () {
      let result = {}

      const object = {
        track: 12,
        album: 6,
        artist: 4,
        playlist: 9
      };

      for (const property in object) {
        let req = await axios({
          method: 'post',
          url: `${import.meta.env.VITE_BACK}/standard/search?limit=${object[property]}`,
          data: {
            query: this.searchInput,
            type: property
          }
        })

        result[property] = req.data;
      }

      this.searchResult = result;
    },
    playFromProvider: async function (data) {

      let track = await getYoutubeVideoFromProvider(data);

      //Store music locally for later.
      this.store.currentMusic = track;
      localStorage.setItem('track', JSON.stringify(track));

      //Announces the arrival of the music.
      this.eventBus.emit('play', track)

      // Put in the queue the other music you are looking for.
      this.store.queue = [];
      this.store.cache_queue = [];
      this.store.shuffle_cache_queue = [];
      this.searchResult.track.forEach(el => {
        if (data.id !== el.id) {
          track = {
            trackId: el.id,
            videoId: null,
            title: el.title_short ? el.title_short : el.title,
            artist: {
              id: el.artist.id,
              name: el.artist.name,
            },
            album: {
              id: el.album.id,
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
    },
  },
  setup() {
    const store = useStore()
    return {
      store,
      toHumanString, cleanString
    }
  }
}

</script>

<style scoped lang="scss">
@import '../assets/style/pages/search.scss';
</style>
