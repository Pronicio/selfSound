<template>
  <section>
    <h1>Toutes nos radios :</h1>
    <div class="radios">
      <div v-for="station in radios" :key="station.name">
        <div class="station" v-if="station?.favicon" @click="playRadio(station)">
          <img :src="station.favicon" width="100" height="100"  alt="station icon" loading="lazy" onerror="this.onerror=null;this.src='https://i.goopics.net/wge2zb.png';"/>
          <h3>{{ station.name }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "Radio",
  data: function () {
    return {
      radios: []
    }
  },
  beforeMount: async function () {
    await this.getRadiosByCountry()
  },
  methods: {
    getRadiosByCountry: async function () {
      const countryCode = this.getLang()
      const req = await axios.get(`https://nl1.api.radio-browser.info/json/stations/search?limit=200&language=${countryCode}&hidebroken=true&order=clicktrend&reverse=true`)
      this.radios = req.data
    },
    getLang: function () {
      return localStorage.getItem('lang') || navigator.language.trim().split(/-|_/)[0]
    },
    playRadio: function (station) {
      this.eventBus.emit('play_radio', station)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../assets/style/pages/radio.scss';
</style>
