<template>
  <Sidebar />
  <router-view/>
  <Trackbar />
</template>

<script setup>
import Sidebar from './components/partials/Sidebar.vue'
import Trackbar from './components/music/Trackbar.vue'
</script>

<style lang="scss">
@import './assets/style/style.scss';
</style>
