<template>
  <header>
    <div class="buttons">
      <div class="prev ic-chevron" onclick="history.back()"></div>
      <div class="after ic-chevron" onclick="history.forward()"></div>
    </div>
    <div class="right">
      <div class="search">
        <div class="ic-search"></div>
        <input type="text" v-model="search" placeholder="Search...">
      </div>
      <img :src="userAvatar" class="user" alt="user avatar" width="50"/>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  data: function () {
    return {
      search: null,
      userAvatar: "https://secure.gravatar.com/avatar/68e616655eb77bb1b600d25e6735f364"
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/components/header.scss';
</style>
