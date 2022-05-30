<template>
  <div class="search">
    <h3 v-if="searchResult.track.length">Tracks :</h3>

    <div class="result">
      <div v-for="item in searchResult.track" :key="item.id" :id="item.id">
        <img
          :src="item.album.cover_medium"
          alt="Album cover"
          loading="lazy"
          @click="play(item)"
        />
        <h4>{{ item.title.substring(0, 33) }}</h4>
        <p class="sub-text">{{ item.artist.name.substring(0, 33) }}</p>
      </div>
    </div>

    <h3 v-if="searchResult.album.length">Albums :</h3>

    <div class="result">
      <div v-for="item in searchResult.album" :key="item.id" :id="item.id">
        <img
          :src="item.cover_medium"
          alt="Album cover"
          loading="lazy"
          @click="
            this.$router.push({ name: 'Album', params: { query: item.id } })
          "
        />
        <h4>{{ item.title.substring(0, 33) }}</h4>
        <p class="sub-text">{{ item.artist.name.substring(0, 33) }}</p>
      </div>
    </div>

    <h3 v-if="searchResult.artist.length">Artists :</h3>

    <div class="result">
      <div v-for="item in searchResult.artist" :key="item.id" :id="item.id">
        <img
          class="rounded_img"
          :src="item.picture_medium"
          alt="Artist picture"
          loading="lazy"
        />
      </div>
    </div>

    <h3 v-if="searchResult.playlist.length">Playlists :</h3>

    <div class="result">
      <div v-for="item in searchResult.playlist" :key="item.id" :id="item.id">
        <img :src="item.picture_medium" alt="Playlist cover" loading="lazy" />
        <h4>{{ item.title.substring(0, 33) }}</h4>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useStore } from "@/store/main";

export default {
  name: "Search",
  data: function () {
    return {
      searchInput: this.$route.params.query,
      searchResult: {
        track: [],
        album: [],
        artist: [],
        playlist: [],
      },
    };
  },
  mounted: function () {
    this.eventBus.on("onSearch", (data) => {
      this.searchInput = data;
      this.search();
    });

    document.title = "SelfSound - Search";
  },
  created: function () {
    if (this.$route.params.query) {
      this.search();
    } else {
      this.$router.push("/");
    }
  },
  methods: {
    search: async function () {
      let result = {};

      const object = {
        track: 10,
        album: 6,
        artist: 4,
        playlist: 7,
      };

      for (const property in object) {
        let req = await axios({
          method: "post",
          url: `${import.meta.env.VITE_BACK}/standard/search?limit=${
            object[property]
          }`,
          data: {
            query: this.searchInput,
            type: property,
          },
        });

        result[property] = req.data;
      }

      this.searchResult = result;
    },
    play: async function (data) {
      let req = await axios({
        method: "post",
        url: `${import.meta.env.VITE_BACK}/youtube/search?music=true`,
        data: {
          query: `${data.title} ${data.artist.name}`,
        },
      });

      let track = {
        trackId: data.id,
        videoId: req.data.id,
        title: data.title_short ? data.title_short : data.title,
        artist: {
          id: data.artist.id,
          name: data.artist.name,
        },
        album: {
          id: data.album.id,
          cover: {
            big: data.album.cover_big,
            xl: data.album.cover_xl,
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
    return { store };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/style/pages/search.scss";
</style>
