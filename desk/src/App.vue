<template>
  <Navbar></Navbar>
  <section class="main">
    <Header></Header>
    <main>
      <router-view/>
    </main>
    <footer></footer>
  </section>
</template>

<script>
import { getStream } from "./structure/api.js";
import Navbar from "./components/Navbar.vue";
import Header from "./components/Header.vue";

import { Youtube } from "./structure/api.js";

export default {
  name: "App",
  components: {
    Navbar, Header
  },
  data: function () {
    return {
      code: "CVXOJ-CBcJQ",
      url: null
    }
  },
  mounted() {
    const ytb = new Youtube()
    ytb.initalize().then()
  },
  methods: {
    async start() {
      const data = await getStream(this.code)

      if (data.type === "stream") {
        this.url = data.url;
      }
    }
  }
}
</script>

<style lang="scss">
@import './assets/style/style.scss';
</style>
