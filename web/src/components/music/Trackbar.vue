<template>
  <div class="trackbar">
    <img class="cover" src="https://e-cdns-images.dzcdn.net/images/cover/57975f903eb1a6323d03d735eca9c3fa/1000x1000-000000-80-0-0.jpg" width="80" alt="cover"/>
    <div class="track">
      <div>
        <p>all I want is you (feat. hoshie star)</p>
        <p>Rebzyyx</p>
      </div>
      <img width="30" src="../../assets/images/icons/full_heart.svg" alt=""/>
    </div>
    <div class="progressbar">
      <div class="controls">
        <div id="shuffle"></div>
        <div id="backward"></div>
        <div id="forward"></div>
        <div id="repeat-mode"></div>
      </div>
      <div class="slider">
        <p id="rangeValue"> {{ sliderValue }}</p>
        <input @mousemove="changeProgress" type="range" id="slider" value="1">
        <p id="rangeValueFinal">2:30</p>
      </div>
    </div>
    <div class="tools"></div>
  </div>
</template>

<script>

export default {
  name: "TrackBar",
  data: function () {
    return {
      sliderValue: 1
    }
  },
  mounted: function () {
  },
  methods: {
    changeProgress: function () {
      this.sliderValue = document.getElementById('slider').value;
    }
  }
}

</script>

<style scoped lang="scss">
@import '../../assets/style/components/trackbar.scss';
</style>
