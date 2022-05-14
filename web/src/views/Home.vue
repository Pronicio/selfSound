<script setup>
import axios from 'axios';
import { ref } from 'vue'

const searchInput = ref("Hello - Adele");
let searchResult = ref()

async function search() {
  let req = await axios({
    method: 'post',
    url: 'http://localhost:9000/standard/search?limit=10',
    data: {
      query: searchInput.value
    }
  })

  searchResult = req.data;
}
</script>

<template>
  <h1>SelfSound : </h1>

  <form v-on:submit.prevent="search">
    <label for="music-search">Search the music:</label>
    <input type="search" id="music-search" v-model="searchInput">

    <button>Search</button>
  </form>

  <p>{{ searchResult }}</p>

  <div>
    <div v-for="item in searchResult" :key="item.id">
      {{ item }}
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

</style>
