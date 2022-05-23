<template>
  <div class="header">
    <div class="left">
      <form v-on:submit.prevent="search">
        <div class="search-icon"></div>
        <input type="search" v-model="searchInput" placeholder="Search a music...">
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
      searchInput: this.$route.params.query
    }
  },
  methods: {
    search: function () {
      this.$router.push({ name: 'Search', params: { query: this.searchInput } })
      //this.eventBus.emit('onSearch', true)
    }
  }
}

</script>

<style scoped lang="scss">
@import '../../assets/style/components/header.scss';
</style>
