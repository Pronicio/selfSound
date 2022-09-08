<template>
  <Account v-if="accountRoute"/>
  <Client v-else/>
</template>

<script>
import Client from './layout/Client.vue'
import Account from './layout/Account.vue'

export default {
  name: "Home",
  components: {
    Client, Account
  },
  setup() {
    const accountRoute = window.location.pathname === '/login';

    return {
      accountRoute
    }
  }
}

</script>

<style lang="scss">
@import './assets/style/style.scss';
</style>
