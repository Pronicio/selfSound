<template>
  <section>
    <div class="left">
      <div class="first">
        <h2>For you</h2>
        <div class="cards">
          <div class="card" v-for="item in sections.for_you" :key="item.title">
            <img :src="item.img" :alt="item.title"/>
            <div class="content" :style="`background: ${item.color}`">
              <h5>{{ item.sub_title }}</h5>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
            <div class="play_white"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="top">
        <div class="title">
          <h3>Top Streams</h3>
          <a>Global</a>
        </div>
        <div class="musics" @scroll="infiniteScroll">
          <div class="track" v-for="(item, index) in top" :key="item.id" :id="item.id">
            <div class="details" @click="playFromProvider(item)">
              <p class="index">{{ index + 1 }}.</p>
              <img :src="item.album.cover_small" alt="Album Cover" :id="item.album.id"/>
              <div class="info">
                <h6>{{ cleanString(item.title) }}</h6>
                <p :id="item.artist.id" class="artist">{{ item.artist.name }}</p>
              </div>
            </div>
            <div class="actions">
              <div id="like_music"></div>
              <div id="menu"></div>
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
import {cleanString, getYoutubeVideoFromProvider} from "../api";
import {useStore} from "../store/main";

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
      ],
      sections: {
        for_you: [
          {
            img: "https://i.goopics.net/bp66e7.png",
            title: "My New Arrivals",
            sub_title: "New For you",
            description: "Deine Freunde, Moderat",
            color: "rgba(54, 30, 32, 0.5)"
          },
          {
            img: "https://i.goopics.net/m1maim.png",
            title: "Coexist",
            sub_title: "New Track for you",
            description: "Album by The XX",
            color: "rgba(255, 255, 255, 0.5)"
          },
          {
            img: "https://i.goopics.net/92ku9r.png",
            title: "After Hours",
            sub_title: "New Album",
            description: "The Weeknd",
            color: "rgba(59, 67, 27, 0.5)"
          },
          {
            img: "https://i.goopics.net/3vdkof.png",
            title: "If You Wait",
            sub_title: "Based on your likes",
            description: "London Grammar",
            color: "rgba(54, 19, 6, 0.5)"
          },
        ]
      }
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
        url: `${import.meta.env.VITE_BACK}/standard/top_world?limit=10`,
      })

      this.top = req.data.data;
      this.top_next = req.data.next
    },
    moreTopWorldMusics: async function () {
      const index = this.top_next.match(/(?<=index=).*$/g)[0]

      const req = await axios({
        method: 'get',
        url: `${import.meta.env.VITE_BACK}/standard/top_world?limit=10&index=${index}`,
      })

      this.top = this.top.concat(req.data.data)
      this.top_next = req.data.next
    },
    infiniteScroll: function ({ target: { scrollTop, clientHeight, scrollHeight }}) {
      if (scrollTop + clientHeight >= scrollHeight) {
        this.moreTopWorldMusics()
      }
    },
    playFromProvider: async function (data) {
      let track = await getYoutubeVideoFromProvider(data);

      //Store music locally for later.
      this.store.currentMusic = track;
      localStorage.setItem('track', JSON.stringify(track));

      //Announces the arrival of the music.
      this.eventBus.emit('play', track)

      // Put in the queue the other top music.
      this.store.clearAllQueues();

      this.top.forEach(el => {
        if (data.id !== el.id) {
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
    },
  },
  setup: function () {
    const store = useStore()

    return {
      store,
      cleanString
    }
  }
}

</script>


<style scoped lang="scss">
@import '../assets/style/pages/home.scss';
</style>
