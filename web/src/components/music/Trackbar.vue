<template>
  <Transition name="magic">
    <MusicView v-show="view"/>
  </Transition>

  <div class="trackbar" v-if="store.currentMusic.title">
    <div class="infos">
      <img class="cover" :src="store.currentMusic.album.cover.big" width="80" alt="cover"/>
      <div class="track">
        <p>{{ cleanString(store.currentMusic.title) }}</p>
        <p class="sub-text">{{ store.currentMusic.artist.name }}</p>
      </div>
    </div>
    <div class="progressbar">
      <div class="controls">
        <div id="shuffle" @click="control('shuffle')" :style="`filter: ${store.controls.shuffle ? 'var(--base)' : 'var(--unused)'}`"></div>
        <div id="backward" @click="control('backward')"></div>
        <div id="play" @click="changeState($event)"></div>
        <div id="forward" @click="control('forward')"></div>
        <div id="repeat-mode" @click="control('repeat-mode')" :style="`filter: ${store.controls.repeat_mode ? 'var(--base)' : 'var(--unused)'}`"></div>
      </div>
      <div class="slider">
        <p id="rangeValue"> {{ sliderValue }}</p>
        <input @click="changeProgress" type="range" id="slider" value="1">
        <p id="rangeValueFinal">00:00</p>
      </div>
    </div>
    <div class="tools">
      <div id="like"></div>
      <div id="lyrics"></div>
      <div class="volume_wrapper">
        <div id="volume"></div>
        <div class="volume_popover">
          <input type="range" id="volume_slider" :value="store.controls.volume" @input="changeVolume()">
        </div>
      </div>
      <div id="arrow" @click="changeView"></div>
    </div>
  </div>
</template>

<script>
import MusicView from "./MusicView.vue";
import { useStore } from '@/store/main'
import { cleanString } from "../../api";

export default {
  name: "TrackBar",
  data: function () {
    return {
      view: false,
      sliderValue: "00:00"
    }
  },
  components: {
    MusicView
  },
  mounted: function () {
    if (this.store.currentMusic.videoId) {
      this.eventBus.emit('play', this.store.currentMusic)
    }

    this.eventBus.on("putControl", (data) => {
      let play = document.getElementById('play')
      let pause = document.getElementById('pause')

      if (play) play.id = data;
      else pause.id = data;
    })
  },
  methods: {
    changeProgress: function () {
      this.sliderValue = document.getElementById('slider').value;
    },
    changeView: function () {
      this.view = !this.view
      if (this.view) {
        document.getElementById("arrow").classList.add("rotate");
        document.querySelector("body").style.overflow = "hidden"
      } else {
        document.getElementById("arrow").classList.remove("rotate");
        document.querySelector("body").style.overflow = "auto"
      }
    },
    control: function (name) {
      this.eventBus.emit('control', name)
    },
    changeState: function (event) {
      let targetId = event.currentTarget.id;
      let el = document.getElementById(targetId)

      if (targetId === "play") {
        el.id = "pause"
        this.control('play')
      } else {
        el.id = "play"
        this.control('pause')
      }
    },
    changeVolume: function (event) {
      this.control('volume')
    }
  },
  setup() {
    const store = useStore()
    return {
      store,
      cleanString
    }
  },
}

</script>

<style scoped lang="scss">
@import '../../assets/style/components/trackbar.scss';
</style>
