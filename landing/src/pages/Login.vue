<template>
  <section>
    <img class="illustration" src="../assets/images/illustration.png" alt="Illustration">
    <div class="form">
      <img src="../assets/images/icon.svg" alt="Icon" width="72">
      <h1>Login to your Account</h1>
      <h2>See what is going on with your business</h2>
      <button><img class="google" src="../assets/images/google.png" alt="Connect with google" width="25"/>Continue with Google</button>
      <p>------------- or Sign in with Email ------------- </p>
      <form v-on:submit.prevent="login">
        <label for="email">Email</label>
        <input v-model="email" type="email" name="email" id="email" placeholder="mail@provider.com" required>

        <label for="password">Password</label>
        <input v-model="password" type="password" name="password" id="password" placeholder="your password" required>

        <input type="submit" value="Login">
      </form>
    </div>
  </section>
</template>

<script>
import { useHead } from '@vueuse/head'

export default {
  name: "Login",
  data: function () {
    return {
      email: null,
      password: null
    }
  },
  methods: {
    login: function () {
      console.log(this.email, this.password)
    }
  },
  setup() {
    useHead({
      title: 'SelfSound - Login',
    })
  }
}
</script>

<style scoped lang="scss">
@import '../assets/style/login.scss';
</style>
