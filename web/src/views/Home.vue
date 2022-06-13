<template>
  <section>
    <div class="left"></div>
    <div class="right">
      <div class="top">
        <div class="title">
          <h3>Top Streams</h3>
          <a>Global</a>
        </div>
        <div class="musics" @scroll="infiniteScroll">
          <div class="track" v-for="(item, index) in top" :key="item.id" :id="item.id">
            <p id="index">{{ index + 1 }}.</p>
            <img :src="item.album.cover_small" alt="Album Cover"/>
            <div class="info">
              <h6>{{ cleanString(item.title) }}</h6>
              <p>{{ item.artist.name }}</p>
            </div>
          </div>
        </div>
        <div class="more">
          <p @click="moreTopWorldMusics">More...</p>
        </div>
      </div>
      <div class="bottom">
        <div class="title">
          <h3>Categories</h3>
          <a>see all</a>
        </div>
        <div class="categories">
          <div class="genre" v-for="item in categories" :key="item.id" :id="item.id">
            <div class="img" :style="`background: url(https://e-cdns-images.dzcdn.net/images/misc/${item.img}/500x500-000000-80-0-0.jpg) center center / 13rem no-repeat`">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { cleanString } from "../api";

export default {
  name: "Home",
  data: function () {
    return {
      top: [],
      top_next: null,
      categories: [
        { id: 132, name: "Pop", img: "db7a604d9e7634a67d45cfc86b48370a" },
        { id: 116, name: "Rap/Hip Hop", img: "5c27115d3b797954afff59199dad98d1" },
        { id: 152, name: "Rock", img: "b36ca681666d617edd0dcb5ab389a6ac" },
        { id: 113, name: "Dance", img: "bd5fdfa1a23e02e2697818e09e008e69" },
        { id: 165, name: "R&B", img: "68a43aec844708e693cb99f47814153b" },
        { id: 85, name: "Alternative", img: "fd252ab727d9a3b0b3c29014873f8f57" },
        { id: 106, name: "Electro", img: "15df4502c1c58137dae5bdd1cc6f0251" },
        { id: 129, name: "Jazz", img: "91468ecc5dfdd19c42a43d2cbdf27059" },
      ]
    }
  },
  beforeMount: async function() {
    document.title = 'SelfSound - Home'

    await this.getTopWorldMusics();
  },
  methods: {
    getTopWorldMusics: async function () {
      const req = await axios({
        method: 'get',
        url: `${import.meta.env.VITE_BACK}/standard/top_world?limit=6`,
      })

      this.top = req.data.data;
      this.top_next = req.data.next
    },
    moreTopWorldMusics: async function () {
      const index = this.top_next.match(/(?<=index=).*$/g)[0]

      const req = await axios({
        method: 'get',
        url: `${import.meta.env.VITE_BACK}/standard/top_world?limit=6&index=${index}`,
      })

      this.top = this.top.concat(req.data.data)
      this.top_next = req.data.next
    },
    infiniteScroll: function ({ target: { scrollTop, clientHeight, scrollHeight }}) {
      if (scrollTop + clientHeight >= scrollHeight) {
        this.moreTopWorldMusics()
      }
    }
  },
  setup: function () {
    return {
      cleanString
    }
  }
}

</script>


<style scoped lang="scss">
@import '../assets/style/pages/home.scss';
</style>
