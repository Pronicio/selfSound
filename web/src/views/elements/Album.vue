<template>
  <section>
    <img :src="data.cover_big" alt="Album cover" width="250"/>
    <div class="infos">
      <p id="label">{{ data.label }}</p>
      <h1>{{ data.title }}</h1>
      <h2>{{ data.artist.name }}</h2>
      <button>Écouter</button>
    </div>
  </section>
</template>

<script>

import axios from "axios";

export default {
  name: "Album.vue",
  data: function () {
    return {
      id: this.$route.params.query,
      data: {}
    }
  },
  created: function () {
    if (this.$route.params.query) {
      this.getData()
    } else {
      this.$router.push('/')
    }
  },
  methods: {
    getData: async function () {
      let req = await axios({
        method: 'post',
        url: `http://localhost:9000/standard/album`,
        data: {
          id: this.id
        }
      })

      this.data = req.data;
      console.log(this.data);
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/style/pages/elements/album.scss';
</style>
