<template>
  <Header/>
  <Sidebar/>
  <main>
    <router-view/>
  </main>
  <Trackbar/>
  <Radio/>
</template>

<script>
import Header from './components/partials/Header.vue'
import Sidebar from './components/partials/Sidebar.vue'
import Trackbar from './components/music/Trackbar.vue'
import Radio from './components/music/Radio.vue'

export default {
  name: "Home",
  components: {
    Header, Sidebar, Trackbar, Radio
  }
}

</script>

<style lang="scss">
@import './assets/style/style.scss';
</style>
