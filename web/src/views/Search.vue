<template>
  <div class="search">

    <h3 v-if="searchResult.track.length"> Tracks : </h3>

    <div class="result">
      <div v-for="item in searchResult.track" :key="item.id" :id="item.id">
        <img :src="item.album.cover_medium" alt="Album cover" loading="lazy" @click="playFromProvider(item)"/>
        <h4>{{ item.title.substring(0, 33) }}</h4>
        <p class="sub-text">{{ item.artist.name.substring(0, 33) }}</p>
      </div>
    </div>

    <h3 v-if="searchResult.album.length"> Albums : </h3>

    <div class="result">
      <div v-for="item in searchResult.album" :key="item.id" :id="item.id">
        <img :src="item.cover_medium" alt="Album cover" loading="lazy"
             @click="this.$router.push({ name: 'Album', params: { query: item.id } })"/>
        <h4>{{ item.title.substring(0, 33) }}</h4>
        <p class="sub-text">{{ item.artist.name.substring(0, 33) }}</p>
      </div>
    </div>

    <h3 v-if="searchResult.artist.length"> Artists : </h3>

    <div class="result">
      <div v-for="item in searchResult.artist" :key="item.id" :id="item.id">
        <img class="rounded_img" :src="item.picture_medium" alt="Artist picture" loading="lazy"/>
      </div>
    </div>

    <h3 v-if="searchResult.playlist.length"> Playlists : </h3>

    <div class="result">
      <div v-for="item in searchResult.playlist" :key="item.id" :id="item.id">
        <img :src="item.picture_medium" alt="Playlist cover" loading="lazy"/>
        <h4>{{ item.title.substring(0, 33) }}</h4>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import {useStore} from '@/store/main'

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
  mounted: function () {
    this.eventBus.on('onSearch', (data) => {
      this.searchInput = data;
      this.search();
    })

    document.title = 'SelfSound - Search'
  },
  created: function () {
    if (this.$route.params.query) {
      this.search()
    } else {
      this.$router.push('/')
    }
  },
  methods: {
    search: async function () {
      let result = {}

      const object = {
        track: 10,
        album: 6,
        artist: 4,
        playlist: 7
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

      // Put in the queue the other music you are looking for, if it is empty.
      if (!!this.store.queue.length) {
        this.store.queue = []
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
      }
    }
  },
  setup() {
    const store = useStore()
    return {store}
  }
}

</script>

<style scoped lang="scss">
@import '../assets/style/pages/search.scss';
</style>
