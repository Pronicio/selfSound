<template>
  <div class="header">
    <div class="left">
      <form v-on:submit.prevent="search">
        <div @click="search" class="search-icon"></div>
        <input type="search" v-model="searchInput" placeholder="Rechercher...">
      </form>
    </div>
    <div class="right">
      <img src="https://secure.gravatar.com/avatar/68e616655eb77bb1b600d25e6735f364" width="50" alt="profile picture"/>
      <h4>Pronicio</h4>
    </div>
  </div>
</template>

<script>

export default {
  name: "Header",
  data: function () {
    return {
      searchInput: null
    }
  },
  mounted: function () {
    try {
      let url = decodeURI(window.location.href);
      this.searchInput = url.match(/search.*$/)[0].replace('search/', '');
    } catch (e) {}
  },
  methods: {
    search: function () {
      this.$router.push({name: 'Search', params: {query: this.searchInput}})
      this.eventBus.emit('onSearch', this.searchInput)
    }
  }
}

</script>

<style scoped lang="scss">
@import '../../assets/style/components/header.scss';
</style>
