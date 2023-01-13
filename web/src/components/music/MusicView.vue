<template>
  <section>
    <div class="background-filter"></div>
    <div class="background" :style="'background: url('+ videoThumbnail +') center center / cover no-repeat;'"></div>
    <div class="main">
      <div class="video">
        <img src="../../assets/images/logo.svg" width="200" alt=""/>
        <div class="media">
          <div id="player"></div>
        </div>
      </div>
      <div class="right">
        <div class="selector">
          <h3 @click="switchWin('Queue')" class="current" id="Queue">Queue</h3>
          <p>|</p>
          <h3 @click="switchWin('Lyrics')" id="Lyrics">Lyrics</h3>
        </div>
        <Transition name="magic">
          <component :is="activeComponent"></component>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script>
import Queue from './Queue.vue'
import Lyrics from './Lyrics.vue'
import { useStore } from '@/store/main'
import { secondsToString } from '@/api'
import axios from "axios";
import { getYoutubeVideoFromProvider } from "@/api";

export default {
  name: "MusicView",
  components: {
    Queue, Lyrics
  },
  data: function () {
    return {
      videoThumbnail: this.store.currentMusic.album.cover.xl,
      player: null,
      iframeEnable: false,
      interval: null,
      activeComponent: 'Queue'
    }
  },
  mounted: async function () {
    window.onYouTubeIframeAPIReady = () => {
      this.iframeEnable = true;
    };

    this.eventBus.on('play', (data) => {
      this.videoThumbnail = data.album.cover.xl;
      this.playVideo()
      this.store.currentMusic.lyrics = []
    })

    this.eventBus.on('play_radio', (station) => {
      this.player.pauseVideo();
    })

    this.eventBus.on("control", (data) => {
      if (data === "play") this.player.playVideo();
      if (data === "pause") this.player.pauseVideo();
      if (data === "volume") {
        let value = document.getElementById('volume_slider').value
        localStorage.setItem('volume', value);

        this.store.controls.volume = value
        this.player.setVolume(value);
      }
      if (data === "backward") this.beforeMusic();
      if (data === "forward") this.nextMusic();

      if (data === "shuffle") this.shuffle();
      if (data === "repeat-mode") this.repeat_mode();
    })

    const slider = document.getElementById('slider');
    if (!slider) return

    slider.addEventListener('click', e => {
      clearInterval(this.interval);

      let duration = this.player.getDuration()
      let currentDuration = document.getElementById('slider').value

      let goTo = (currentDuration * duration) / 100

      document.getElementById('slider').value = currentDuration
      document.getElementById("rangeValue").innerHTML = this.secondsToString(currentDuration)

      this.player.seekTo(goTo)
    });
  },
  methods: {
    playVideo: async function () {
      const options = {
        height: '360',
        width: '640',
        videoId: this.store.currentMusic.videoId,
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange
        },
        playerVars: {
          controls: 1
        }
      }

      if (!this.iframeEnable) {
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        this.player.destroy();
        this.player = new YT.Player('player', Object.assign(options, { playerVars: { 'autoplay': 1 } }));
        this.eventBus.emit('putControl', 'pause')
      }
    },
    playFromProvider: async function (data) {
      const req = await getYoutubeVideoFromProvider(data);
      const track = Object.assign(data, { videoId: req.videoId })

      this.play(track)
    },
    play: function (track) {
      this.store.currentMusic = track;
      localStorage.setItem('track', JSON.stringify(track));

      this.eventBus.emit('play', track)
    },
    onPlayerReady: function () {
      document.getElementById("rangeValueFinal").innerHTML = this.secondsToString(this.player.getDuration());

      this.player.setVolume(this.store.controls.volume);
    },
    onPlayerStateChange: function (event) {
      if (event.data === 1) {
        this.eventBus.emit('forceState', "play")
        this.interval = setInterval(this.timer, 1000);
      }

      if (event.data !== 1) {
        clearInterval(this.interval);
      }

      if (event.data === 2) {
        this.eventBus.emit('forceState', "pause")
      }

      if (event.data === 0) {
        //If repeat mode is enabled then replay
        if (this.store.controls.repeat_mode) {
          return this.playVideo();
        }

        //If the music is over then put the next one on if there is a queue.
        //Then remove it from the queue.
        this.nextMusic()
      }
    },
    nextMusic: function () {
      if (this.store.queue.length) {
        this.store.cache_queue.push(this.store.currentMusic)
        if (!this.store.queue[0].videoId) this.playFromProvider(this.store.queue[0]);
        else this.play(this.store.queue[0])
        this.store.queue.shift();
      }
    },
    beforeMusic: function () {
      if (this.store.cache_queue.length) {
        let musicToPut = this.store.cache_queue.pop();
        if (!this.store.queue[0].videoId) this.playFromProvider(musicToPut);
        else this.play(musicToPut)
        this.store.queue.unshift(this.store.currentMusic)
      }
    },
    shuffle: function () {
      const queue = this.store.queue;
      const shuffle_cache_queue = this.store.shuffle_cache_queue

      if (queue.length) {
        if (this.store.controls.shuffle) {
          this.store.controls.shuffle = false
          if (shuffle_cache_queue.length) this.store.queue = shuffle_cache_queue
        } else {
          this.store.controls.shuffle = true
          this.store.shuffle_cache_queue = [ ...queue ];

          this.store.shuffleQueue();
        }
      }

      this.store.saveControls()

    },
    repeat_mode: function () {
      this.store.controls.repeat_mode = !this.store.controls.repeat_mode
      this.store.saveControls()
    },
    timer: function () {
      const duration = this.player.getDuration()
      const currentDuration = this.player.getCurrentTime()

      document.getElementById('slider').value = (currentDuration * 100) / duration
      document.getElementById("rangeValue").innerHTML = this.secondsToString(currentDuration)
    },
    switchWin: function (name) {
      if (this.activeComponent === name) return;
      this.activeComponent = name

      document.querySelector(".current").classList.remove("current");
      document.getElementById(name).classList.add("current");
    }
  },
  setup() {
    const store = useStore()
    return { store, secondsToString }
  },
  watch: {
    iframeEnable(value) {
      let options = {
        height: '360',
        width: '640',
        videoId: this.store.currentMusic.videoId,
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange
        },
        playerVars: {
          controls: 1
        }
      }
      this.player = new YT.Player('player', options);
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/style/components/musicview.scss';
</style>
