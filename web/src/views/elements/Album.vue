<template>
  <section class="sec1">
    <img
      class="album_cover"
      :src="data.cover_big"
      alt="Album cover"
      width="250"
    />
    <div class="infos">
      <p id="label">{{ data.label }}</p>
      <h1>{{ data.title }}</h1>
      <div class="artist">
        <img
          class="artist_picture"
          :src="data.artist.picture_small"
          alt="Artist picture"
          width="30"
        />
        <h2>{{ data.artist.name }}</h2>
      </div>
      <p>
        {{ data.nb_tracks }} track(s) -
        {{ secondsToString(data.duration, true) }} - {{ data.release_date }}
      </p>
      <div class="controls">
        <button id="listen">
          <div class="logo_play"></div>
          Écouter
        </button>
        <button id="like"></button>
      </div>
    </div>
  </section>
  <section class="sec2">
    <h2>Tracks :</h2>
    <div class="tracks">
      <div
        class="track"
        v-for="(item, index) in data.tracks.data"
        :key="item.id"
        :id="item.id"
        @click="play(item)"
      >
        <div class="details">
          <img :src="data.cover_small" alt="Album cover" width="50" />
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
import { secondsToString } from "@/api";
import { useStore } from "@/store/main";

export default {
  name: "Album.vue",
  data: function () {
    return {
      id: this.$route.params.query,
      data: {
        artist: {
          picture_small: null,
        },
      },
    };
  },
  created: function () {
    if (this.$route.params.query) {
      this.getData();
    } else {
      this.$router.push("/");
    }
  },
  methods: {
    getData: async function () {
      let req = await axios({
        method: "post",
        url: `${import.meta.env.VITE_BACK}/standard/album`,
        data: {
          id: this.id,
        },
      });

      this.data = req.data;
      document.title = `SelfSound - ${this.data.title}`;
    },
    play: async function (music) {
      let req = await axios({
        method: "post",
        url: `${import.meta.env.VITE_BACK}/youtube/search?music=true`,
        data: {
          query: `${music.title} ${music.artist.name}`,
        },
      });

      let track = {
        trackId: music.id,
        videoId: req.data.id,
        title: music.title_short ? music.title_short : music.title,
        artist: {
          id: music.artist.id,
          name: music.artist.name,
        },
        album: {
          id: this.data.id,
          cover: {
            big: this.data.cover_big,
            xl: this.data.cover_xl,
          },
        },
      };

      this.store.currentMusic = track;
      localStorage.setItem("track", JSON.stringify(track));

      this.eventBus.emit("play", track);

      this.store.queue = req.data;
    },
  },
  setup() {
    const store = useStore();

    return {
      secondsToString,
      store,
    };
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/style/pages/elements/album.scss";
</style>
