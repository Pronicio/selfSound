<template>
  <section class="home">
    <div class="left">
      <h2>Recently Played</h2>
    </div>
    <div class="right"></div>
  </section>
</template>

<script>
export default {
  data: function () {
    return {
      recent: []
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/pages/home.scss';
</style>
