<template>
  <section>
    <div class="user">
      <img class="lazy" :src="user.picture_medium" alt="User picture" width="250" height="250"/>
      <h1>{{ user.name }}</h1>
      <div class="flag" :style="`background: url('${flag}') no-repeat;`"></div>
    </div>
    <div class="options">
      <p class="selected">Flow</p>
      <p>Charts</p>
      <p>Playlists</p>
      <p>Albums</p>
      <p>Artists</p>
    </div>
    <div class="data">
      <div class="title">
        <h2>Flow :</h2>
        <div class="move">
          <div class="back" @click="back"></div>
          <div class="next" @click="next"></div>
        </div>
      </div>
      <div class="flow">
        <div class="track" v-for="track in this.flow">
          <img class="lazy" :src="track.album.cover_medium" alt="Album cover" loading="lazy"
               @click="playFromProvider(track, 'flow')"/>
          <h3 @click="playFromProvider(track, 'flow')">{{ track.title_short ? track.title_short : track.title }}</h3>
          <p>{{ track.artist.name }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { useStore } from '@/store/main'
import { getYoutubeVideoFromProvider } from "../../api";

export default {
  name: "Profile",
  data: function () {
    return {
      id: this.$route.params.query,
      user: {
        picture_medium: "data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      },
      flag: null,
      flow: []
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
    const scrollContainer = document.querySelector(".flow");

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
      await this.getFlow()
    },
    getFlow: async function () {
      let req = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BACK}/standard/profile/flow`,
        data: {
          id: this.id
        }
      })

      this.flow = req.data.data;
      document.title = `SelfSound - ${this.user.name} - Flow`
    },
    back: function () {
      const scrollContainer = document.querySelector(".flow");
      scrollContainer.scrollLeft += 250;
    },
    next: function () {
      const scrollContainer = document.querySelector(".flow");
      scrollContainer.scrollLeft += -250;
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
    }
  },
  setup() {
    const store = useStore()

    return {
      store
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/style/pages/elements/profile.scss';
</style>
