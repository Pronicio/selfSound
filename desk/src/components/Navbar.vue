<template>
  <section class="navbar">
    <img src="../assets/images/logo.svg" alt="Logo" width="34">
    <div class="box">
      <router-link to="/"><div class="ic ic-home"></div></router-link>
      <router-link to="/"><div class="ic ic-playlist"></div></router-link>
      <router-link to="/"><div class="ic ic-radio"></div></router-link>
      <router-link to="/"><div class="ic ic-videos"></div></router-link>
    </div>
    <div class="box">
      <router-link to="/"><div class="ic ic-profile"></div></router-link>
      <router-link to="/"><div class="ic ic-logout"></div></router-link>
    </div>
  </section>
</template>

<script>
export default {
  name: "Navbar"
}
</script>

<style lang="scss" scoped>
@import '../assets/style/components/navbar.scss';
</style>
