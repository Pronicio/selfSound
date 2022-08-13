<template>
  <section>
    <div class="user">
      <img class="lazy" :src="user.picture_medium" alt="User picture" width="250" height="250"/>
      <h1>{{ user.name }}</h1>
      <div class="flag" :style="`background: url('${flag}') no-repeat;`"></div>
    </div>
    <div class="options">
      <p id="flow" class="selected" @click="currentNav = 'flow'">Flow</p>
      <p id="charts" @click="currentNav = 'charts'">Charts</p>
      <p id="playlists" @click="currentNav = 'playlists'">Playlists</p>
      <p id="albums" @click="currentNav = 'albums'">Albums</p>
      <p id="artists" @click="currentNav = 'artists'">Artists</p>
    </div>
    <div class="data">
      <div class="title">
        <h2>{{ currentNav.charAt(0).toUpperCase() + currentNav.slice(1) }} :</h2>
        <div class="move">
          <div class="back" @click="back"></div>
          <div class="next" @click="next"></div>
        </div>
      </div>
      <div class="list">
        <div class="tracks" v-if="currentNav === 'flow' || currentNav === 'charts'">
          <div class="track" v-for="track in this[currentNav]">
            <img class="lazy" :src="track.album.cover_medium" alt="Album cover" loading="lazy"
                 @click="playFromProvider(track, 'flow')"/>
            <h3 @click="playFromProvider(track, 'flow')">{{ track.title_short ? track.title_short : track.title }}</h3>
            <p>{{ track.artist.name }}</p>
          </div>
        </div>
        <div class="groups" v-if="currentNav === 'playlists' || currentNav === 'albums'">
          <div class="group" v-for="list in this[currentNav]">
            <img class="lazy" :src="list.picture_medium || list.cover_medium" alt="Cover" loading="lazy"
                 @click="sendToPage(list)"/>
            <h3 @click="sendToPage(list)">{{ list.title }}</h3>
            <p>{{ list.creator?.name || list.artist.name }}</p>
          </div>
        </div>
        <div class="artists" v-if="currentNav === 'artists'">
          <div class="artist" v-for="artist in this.artists">
            <img class="lazy" :src="artist.picture_medium" alt="Cover" loading="lazy"/>
            <h3>{{ artist.name }}</h3>
            <p>{{ toHumanString(artist.nb_fan) }} fans</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { useStore } from '@/store/main'
import { getYoutubeVideoFromProvider, toHumanString } from "../../api";

export default {
  name: "Profile",
  data: function () {
    return {
      id: this.$route.params.query,
      user: {
        picture_medium: "data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      },
      flag: null,
      currentNav: 'flow',
      flow: [],
      charts: [],
      playlists: [],
      albums: [],
      artists: []
    }
  },
  beforeMount: function () {
    if (this.$route.params.query) {
      this.getData()
    } else {
      this.$router.push('/')
    }
  },
  mounted() {
    const scrollContainer = document.querySelector(".tracks");

    scrollContainer.addEventListener("wheel", (evt) => {
      evt.preventDefault();
      scrollContainer.scrollLeft += evt.deltaY;
    });
  },
  methods: {
    getData: async function () {
      let req = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BACK}/standard/profile`,
        data: {
          id: this.id
        }
      })

      this.user = req.data;
      this.flag = `https://flagicons.lipis.dev/flags/4x3/${req.data.country.toLowerCase()}.svg`

      document.title = `SelfSound - ${this.user.name}`
      await this.getMoreData()
    },
    getMoreData: async function () {
      if (!this[this.currentNav].length) {
        let req = await axios({
          method: 'post',
          url: `${import.meta.env.VITE_BACK}/standard/profile/${this.currentNav}`,
          data: {
            id: this.id
          }
        })

        this[this.currentNav] = req.data.data;
      }

      document.title = `SelfSound - ${this.user.name} - ${this.currentNav}`

      try {
        const category = this.currentNav === 'flow' || this.currentNav === 'charts' ? 'tracks' : 'groups';
        const scrollContainer = document.querySelector(`.${category}`);

        scrollContainer.addEventListener("wheel", (evt) => {
          evt.preventDefault();
          scrollContainer.scrollLeft += evt.deltaY;
        });
      } catch (e) {
        const scrollContainer = document.querySelector(`.artists`);

        scrollContainer.addEventListener("wheel", (evt) => {
          evt.preventDefault();
          scrollContainer.scrollLeft += evt.deltaY;
        });
      }
    },
    playFromProvider: async function (music, lib) {
      let track = await getYoutubeVideoFromProvider(music);

      //Store music locally for later.
      this.store.currentMusic = track;
      localStorage.setItem('track', JSON.stringify(track));

      //Announces the arrival of the music.
      this.eventBus.emit('play', track)

      // Queue up the other music from the playlist.
      this.store.clearAllQueues();

      this[lib].forEach(el => {
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

      this.store.saveQueue();

      //If the shuffle option is enabled then execute the mix.
      if (this.store.controls.shuffle) {
        this.store.controls.shuffle = false;
        this.eventBus.emit('control', 'shuffle')
      }
    },
    sendToPage: function (list) {
      this.$router.push({ name: list.type.charAt(0).toUpperCase() + list.type.slice(1), params: { query: list.id } })
    },
    back: function () {
      const scrollContainer = document.querySelector(".flow");
      scrollContainer.scrollLeft += 250;
    },
    next: function () {
      const scrollContainer = document.querySelector(".flow");
      scrollContainer.scrollLeft += -250;
    },
  },
  watch: {
    currentNav(newValue, oldValue) {
      const old = document.getElementById(oldValue)
      old.classList.remove("selected")

      const newNav = document.getElementById(newValue)
      newNav.classList.add("selected")

      this.getMoreData()
    }
  },
  setup() {
    const store = useStore()

    return {
      toHumanString,
      store
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/style/pages/elements/profile.scss';
</style>
