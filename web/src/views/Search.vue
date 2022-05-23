<template>
  <div class="search">

    <h3> Tracks : </h3>

    <div class="result">
      <div v-for="item in searchResult.track" :key="item.id" :id="item.id">
        <img :src="item.album.cover_medium" alt="Album cover"/>
        <h4>{{ item.title }}</h4>
        <p class="sub-text">{{ item.artist.name}}</p>
      </div>
    </div>

    <h3> Albums : </h3>

    <div class="result">
      <div v-for="item in searchResult.album" :key="item.id" :id="item.id">
        <img :src="item.cover_medium" alt="Album cover"/>
        <h4>{{ item.title }}</h4>
        <p class="sub-text">{{ item.artist.name}}</p>
      </div>
    </div>

    <h3> Artists : </h3>

    <div class="result">
      <div v-for="item in searchResult.artist" :key="item.id" :id="item.id">
        <img class="rounded_img" :src="item.picture_medium" alt="Artist picture"/>
      </div>
    </div>

    <h3> Playlists : </h3>

    <div class="result">
      <div v-for="item in searchResult.playlist" :key="item.id" :id="item.id">
        <img :src="item.picture_medium" alt="Playlist cover"/>
        <h4>{{ item.title }}</h4>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Search",
  data: function () {
    return {
      searchInput: this.$route.params.query,
      searchResult: {
        track: null,
        album: null,
        artist: null,
        playlist: null
      }
    }
  },
  created: function () {
    console.log("created")
    if (this.$route.params.query) {
      this.search()
    } else {
      this.$router.push('/')
    }
  },
  methods: {
    search: async function() {
      let result = {}

      const object = {
        track: 10,
        album: 4,
        artist: 4,
        playlist: 5
      };

      for (const property in object) {
        let req = await axios({
          method: 'post',
          url: `http://localhost:9000/standard/search?limit=${object[property]}`,
          data: {
            query: this.searchInput,
            type: property
          }
        })

        result[property] = req.data;
      }

      this.searchResult = result;
    }
  }
}

</script>

<style scoped lang="scss">
@import '../assets/style/pages/search.scss';
</style>