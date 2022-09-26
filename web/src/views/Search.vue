<template>
  <div class="source_control">
    <div :class="`toggle ${ytb ? 'toggle-on' : ''}`" id="switch" @click="changeSource">
      <div class="toggle-text-off">STANDARD</div>
      <div class="glow-comp"></div>
      <div class="toggle-button"></div>
      <div class="toggle-text-on">YOUTUBE</div>
    </div>
  </div>
  <div class="search">

    <div v-if="!ytb" id="standard">
      <h3 v-if="searchResult.track.length"> Tracks : </h3>
      <div class="result tracks">
        <div v-for="item in searchResult.track" :key="item.id" :id="item.id">
          <img :src="item.album.cover_medium" alt="Album cover" loading="lazy" @click="playFromProvider(item)"/>
          <div class="title" @click="playFromProvider(item)">
            <h4>{{ item.title }}</h4>
            <p class="sub-text" @click="this.$router.push({ name: 'Artist', params: { query: item.artist.id } })">
              {{ item.artist.name }}</p>
          </div>
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
        <div v-for="item in searchResult.artist" :key="item.id" :id="item.id" class="artist_section"
             @click="this.$router.push({ name: 'Artist', params: { query: item.id } })">
          <img class="rounded_img" :src="item.picture_medium" alt="Artist picture" loading="lazy"/>
          <h5>{{ item.name }}</h5>
          <p class="sub-text">{{ toHumanString(item.nb_fan) }} fans</p>
        </div>
      </div>

      <h3 v-if="searchResult.playlist.length"> Playlists : </h3>
      <div class="result">
        <div v-for="item in searchResult.playlist" :key="item.id" :id="item.id"
             @click="this.$router.push({ name: 'Playlist', params: { query: item.id } })">
          <img :src="item.picture_medium" alt="Playlist cover" loading="lazy"/>
          <h4>{{ cleanString(item.title) }}</h4>
        </div>
      </div>

      <div class="center">
        <h3 v-if="!searchResult.track.length && !searchResult.album.length && !searchResult.artist.length && !searchResult.playlist.length && finished.standard">
          No Results :(</h3>
        <div class="loader" v-if="!finished.standard"></div>
      </div>
    </div>

    <div v-else id="ytb">
      <h3 v-if="ytb_searchResult.length"> Vidéos : </h3>
      <div class="result">
        <div v-for="item in ytb_searchResult" :key="item.id" :id="item.id" @click="playFromYtb(item)">
          <div class="video_cover"
               :style="`background: url('https://img.youtube.com/vi/${item.id}/mqdefault.jpg') no-repeat center;`"/>
          <div class="title">
            <h4>{{ item.title }}</h4>
            <p class="channel_name">{{ item.channel.name }}</p>
            <p class="description sub-text">{{ item.description }}</p>
          </div>
        </div>
      </div>
      <div class="center">
        <h3 v-if="!ytb_searchResult.length && !ytb_searchResult.length && !ytb_searchResult.length && !ytb_searchResult.length && finished.ytb">
          No Results :(</h3>
        <div class="loader" v-if="!finished.ytb"></div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { useStore } from '@/store/main'
import { getYoutubeVideoFromProvider, formatYoutubeVideo, toHumanString, cleanString } from "../api";

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
      },
      finished: {
        standard: false,
        ytb: false
      },
      ytb: !!localStorage.getItem('ytb'),
      ytb_searchResult: []
    }
  },
  beforeMount: function () {
    if (this.$route.params.query) {
      this.search();
      this.ytb_search()
    } else {
      this.$router.push('/')
    }
  },
  mounted: function () {
    this.eventBus.on('onSearch', (data) => {
      this.searchInput = data;

      this.search();
      this.ytb_search()
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

        if (property === "playlist") {
          this.finished.standard = true
        }
      }

      this.searchResult = result;
    },
    ytb_search: async function () {
      let req = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BACK}/youtube/search?limit=${20}`,
        data: {
          query: this.searchInput
        }
      })

      this.ytb_searchResult = req.data;
      this.finished.ytb = true
    },
    playFromProvider: async function (data) {
      let track = await getYoutubeVideoFromProvider(data);

      this.play(track).then();

      // Put in the queue the other music you are looking for.
      this.store.clearAllQueues();

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

      this.store.saveQueue();

    },
    playFromYtb: async function (data) {
      let track = formatYoutubeVideo(data);

      this.play(track).then();

      // Put in the queue the other music you are looking for.
      this.store.clearAllQueues();

      this.ytb_searchResult.forEach(el => {
        if (data.id !== el.id) {
          track = formatYoutubeVideo(el);
          this.store.queue.push(track)
        }
      })

      //If the shuffle option is enabled then execute the mix.
      if (this.store.controls.shuffle) {
        this.store.controls.shuffle = false;
        this.eventBus.emit('control', 'shuffle')
      }

      this.store.saveQueue();
    },
    play: async function (track) {
      //Store music locally for later.
      this.store.currentMusic = track;
      localStorage.setItem('track', JSON.stringify(track));

      //Announces the arrival of the music.
      this.eventBus.emit('play', track)
    },
    changeSource: function () {
      const el = document.getElementById('switch')
      this.ytb = el.classList.toggle('toggle-on');

      if (this.ytb) {
        localStorage.setItem('ytb', true)
        if (!this.ytb_searchResult.length) this.ytb_search()
      } else {
        localStorage.removeItem('ytb')
        if (!this.searchResult.track.length) this.search()
      }
    }
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
@import '../assets/style/pages/youtube_search.scss';
</style>
