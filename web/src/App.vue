<template>
  <Header />
  <Sidebar/>
  <main>
    <router-view/>
  </main>
  <Trackbar/>
</template>

<script>
import Header from './components/partials/Header.vue'
import Sidebar from './components/partials/Sidebar.vue'
import Trackbar from './components/music/Trackbar.vue'

export default {
  name: "Home",
  components: {
    Sidebar, Trackbar, Header
  }
}

</script>

<style lang="scss">
@import './assets/style/style.scss';
</style>
