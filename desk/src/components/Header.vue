<template>
  <header>
    <div class="ic-search"></div>
    <input type="text" v-model="search" placeholder="Search...">
  </header>
</template>

<script>
export default {
  name: "Header",
  data: function () {
    return {
      search: null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/components/header.scss';
</style>
