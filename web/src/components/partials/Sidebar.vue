<template>
  <div class="sidebar">
    <img src="../../assets/images/logo.svg"  alt="logo"/>

    <div class="nav">
      <ul>
        <li @click="this.$router.push('/')" :class="`primitive ${this.$route.name === 'Home' ? 'selected' : ''}`"><div class="home"></div> Accueil</li>
        <li @click="this.$router.push('/discover')" :class="`primitive ${this.$route.name === 'Discover' ? 'selected' : ''}`"><div class="discover"></div> Découvrir</li>
        <li @click="this.$router.push('/radio')" :class="`primitive ${this.$route.name === 'Radio' ? 'selected' : ''}`"><div class="radio"></div> Radios</li>

        <h5>Bibliothèque :</h5>
        <ul>
          <li>Explorer</li>
          <li>Favoris</li>
          <li>Playlists</li>
          <li>Albums</li>
          <li>Artistes</li>
        </ul>

        <h5>Playlists :</h5>
        <ul>
          <li>Exemple 112</li>
          <li id="create_playlist"><div class="addp"></div> Créer une playlist</li>
        </ul>

      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: "SideBar",
  data: function () {
    return {}
  },
  methods: {}
}

</script>

<style scoped lang="scss">
@import '../../assets/style/components/sidebar.scss';
</style>
