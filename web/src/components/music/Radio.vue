<template>
  <div class="radio" v-show="radio.url">
    <audio autoplay :src="radio.url"></audio>
    <img :src="radio.favicon" alt="Radio Logo" width="80" height="80"
         onerror="this.onerror=null;this.src='https://i.goopics.net/wge2zb.png';"/>
    <div class="controls">
      <div id="stopRadio" @click="changeState($event)"></div>
      <p>{{ radio.name }}</p>
    </div>
    <div class="volume">
      <div id="volume_icon"></div>
      <input id="radio_volume_slider" type="range" :value="store.controls.volume" @input="changeVolume()">
    </div>
  </div>
</template>

<script>
import { useStore } from '@/store/main'
import axios from "axios";

export default {
  name: "Radio",
  data: function () {
    return {
      radio: {
        url: null
      }
    }
  },
  mounted: async function () {
    this.eventBus.on('play_radio', (station) => {
      const audio = document.querySelector('audio')

      this.radio = station;
      audio.volume = this.store.controls.volume / 100
    })

    this.eventBus.on('play', (data) => {
      this.radio.url = null
    })
  },
  methods: {
    changeState: function (event) {
      const targetId = event.currentTarget.id;
      const el = document.getElementById(targetId)
      const audio = document.querySelector('audio')

      if (targetId === "playRadio") {
        el.id = "stopRadio";
        audio.play()
      } else {
        el.id = "playRadio";
        audio.pause()
      }
    },
    changeVolume: function () {
      const audio = document.querySelector('audio')
      let value = document.getElementById('radio_volume_slider').value

      localStorage.setItem('volume', value);
      this.store.controls.volume = value
      audio.volume = value / 100
    }
  },
  setup() {
    const store = useStore()
    return {
      store,
    }
  },
}
</script>

<style scoped lang="scss">
@import '../../assets/style/components/radiobar.scss';
</style>
