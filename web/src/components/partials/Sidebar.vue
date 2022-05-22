<template>
  <div class="sidebar">
    <img src="../../assets/images/logo.svg"  alt="logo"/>

    <div class="nav">
      <ul>
        <li @click="this.$router.push('/')" :class="`primitive ${this.$route.name === 'Home' ? 'selected' : ''}`"><div class="home"></div> Accueil</li>
        <li @click="this.$router.push('Discover')" :class="`primitive ${this.$route.name === 'Discover' ? 'selected' : ''}`"><div class="discover"></div> Découvrir</li>
        <li @click="this.$router.push('Radio')" :class="`primitive ${this.$route.name === 'Radio' ? 'selected' : ''}`"><div class="radio"></div> Radios</li>

        <li>Bibliothèque :</li>
        <ul>
          <li>Favoris</li>
          <li>Playlists</li>
          <li>Albums</li>
          <li>Artistes</li>
        </ul>

        <li>Playlists :</li>
        <ul>
          <li>Exemple 112</li>
          <li>Créer une playlist</li>
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

<style lang="scss">
@import '../../assets/style/components/sidebar.scss';
</style>
