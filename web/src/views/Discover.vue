<template>
  <section>
    <h1>Découvrez de nouvelles musiques :</h1>

    <div class="collection genres">
      <div class="card" v-for="genre in genres" :key="genre.id">
        <img :src="genre.picture_medium" alt="Genre Illustration">
        <p>{{ genre.name }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "Discover",
  data: function () {
    return {
      genres: []
    }
  },
  beforeMount() {
    this.getAllGenres()
  },
  methods: {
    getAllGenres: async function () {
      const req = await axios({
        method: 'get',
        url: `${import.meta.env.VITE_BACK}/standard/genres`,
      })

      this.genres = req.data
    }
  }
}
</script>

<style scoped lang="scss">
@import '../assets/style/pages/discover.scss';
</style>
