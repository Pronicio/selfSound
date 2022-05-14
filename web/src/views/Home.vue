<script>
import axios from 'axios';

export default {
  name: "Home",
  data: function () {
    return {
      searchInput: "Hello - Adele",
      searchResult: {
        track: null,
        album: null,
        artist: null,
        playlist: null
      }
    }
  },
  methods: {
    search: async function() {

      const types = ['track', 'album', 'artist', 'playlist'];
      let result = {}

      for (const el of types) {
        let req = await axios({
          method: 'post',
          url: 'http://localhost:9000/standard/search?limit=10',
          data: {
            query: this.searchInput,
            type: el
          }
        })

        result[el] = req.data
      }

      this.searchResult = result;
    }
  }
}

</script>

<template>
  <h1>SelfSound : </h1>

  <form v-on:submit.prevent="search">
    <label for="music-search">Search the music:</label>
    <input type="search" id="music-search" v-model="searchInput">

    <button>Search</button>
  </form>

  <div class="search">

    <h3> Tracks : </h3>

    <div class="result">
      <div v-for="item in searchResult.track" :key="item.id">
        <h4>{{ item.title }} - {{ item.artist.name}}</h4>
        <img :src="item.album.cover_medium" alt="Album cover"/>
      </div>
    </div>

    <h3> Albums : </h3>

    <div class="result">
      <div class="result" v-for="item in searchResult.albums" :key="item.id">
        <h4>{{ item.title }} - {{ item.artist.name}}</h4>
        <img :src="item.cover_medium" alt="Album cover"/>
      </div>
    </div>

    <h3> Artists : </h3>

    <div class="result">
      <div class="result" v-for="item in searchResult.artist" :key="item.id">
        <h4>{{ item.name }}</h4>
        <img :src="item.picture_medium" alt="Artist picture"/>
      </div>
    </div>

    <h3> Playlists : </h3>

    <div class="result">
      <div class="result" v-for="item in searchResult.playlist" :key="item.id">
        <h4>{{ item.title }}</h4>
        <img :src="item.picture_medium" alt="Playlist cover"/>
      </div>
    </div>

  </div>

</template>

<style>
label {
  display: block;
  font: 1rem 'Fira Sans', sans-serif;
}

input,
label {
  margin: .4rem 0;
}

.result {
  display: flex;
  flex-direction: column;
}

</style>
