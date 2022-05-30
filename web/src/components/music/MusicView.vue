<template>
  <section>
    <div
      class="background"
      :style="
        'background: url(' +
        videoThumbnail +
        ') center center / cover no-repeat;'
      "
    ></div>
    <div class="main">
      <img src="../../assets/images/logo.svg" width="200" alt="" />
      <div id="player"></div>
    </div>
  </section>
</template>

<script>
import { useStore } from "@/store/main";
import { secondsToString } from "@/api";

export default {
  name: "MusicView",
  data: function () {
    return {
      videoThumbnail: this.store.currentMusic.album.cover.xl,
      player: null,
      iframeEnable: false,
      interval: null,
    };
  },
  mounted() {
    this.eventBus.on("play", (data) => {
      this.videoThumbnail = data.album.cover.xl;
      this.playVideo();
    });

    this.eventBus.on("control", (data) => {
      if (data === "play") this.player.playVideo();
      if (data === "pause") this.player.pauseVideo();
      if (data === "volume")
        this.player.setVolume(document.getElementById("volume_slider").value);
    });

    const slider = document.getElementById("slider");

    slider.addEventListener("click", (e) => {
      clearInterval(this.interval);

      let duration = this.player.getDuration();
      let currentDuration = document.getElementById("slider").value;

      let goTo = (currentDuration * duration) / 100;

      document.getElementById("slider").value = currentDuration;
      document.getElementById("rangeValue").innerHTML =
        this.secondsToString(currentDuration);

      this.player.seekTo(goTo);
    });
  },
  methods: {
    playVideo: async function () {
      let options = {
        height: "360",
        width: "640",
        videoId: this.store.currentMusic.videoId,
        events: {
          onReady: this.onPlayerReady,
          onStateChange: this.onPlayerStateChange,
        },
      };

      if (!this.iframeEnable) {
        let tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        let firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        this.iframeEnable = true;
        await new Promise((r) => setTimeout(r, 1000));

        this.player = new YT.Player("player", options);
      } else {
        this.player.destroy();
        this.player = new YT.Player(
          "player",
          Object.assign(options, { playerVars: { autoplay: 1 } })
        );

        await new Promise((r) => setTimeout(r, 1000));
        this.eventBus.emit("onControl", "pause");
        this.player.setVolume(document.getElementById("volume_slider").value);
      }
    },
    onPlayerReady: function () {
      document.getElementById("rangeValueFinal").innerHTML =
        this.secondsToString(this.player.getDuration());
    },
    onPlayerStateChange: function (event) {
      if (event.data === 1) {
        this.interval = setInterval(this.timer, 1000);
      }

      if (event.data !== 1) {
        clearInterval(this.interval);
      }
    },
    timer: function () {
      let duration = this.player.getDuration();
      let currentDuration = this.player.getCurrentTime();

      document.getElementById("slider").value =
        (currentDuration * 100) / duration;
      document.getElementById("rangeValue").innerHTML =
        this.secondsToString(currentDuration);
    },
  },
  setup() {
    const store = useStore();
    return { store, secondsToString };
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/style/components/musicview.scss";
</style>
