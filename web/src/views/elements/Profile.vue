<template>
  <section>
    <div class="user">
      <img :src="user.picture_medium" alt="User picture" width="250" height="250"/>
      <h1>{{ user.name }}</h1>
      <div class="flag" :style="`background: url('${flag}')`"></div>
    </div>
    <div class="options">

    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "Profile",
  data: function () {
    return {
      id: this.$route.params.query,
      user: {},
      flag: null
    }
  },
  beforeMount: function () {
    if (this.$route.params.query) {
      this.getData()
    } else {
      this.$router.push('/')
    }
  },
  methods: {
    getData: async function () {
      let req = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BACK}/standard/profile`,
        data: {
          id: this.id
        }
      })

      this.user = req.data;
      this.flag = `https://flagicons.lipis.dev/flags/4x3/${req.data.country.toLowerCase()}.svg`

      document.title = `SelfSound - ${this.user.name}`
    },
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/style/pages/elements/profile.scss';
</style>
