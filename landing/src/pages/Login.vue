<template>
  <section>
    <img class="illustration" src="../assets/images/illustration.png" alt="Illustration">
    <div class="form">
      <img src="../assets/images/icon.svg" alt="Icon" width="50">
      <h1>Login to your Account</h1>
      <h2>See what is going on with your business</h2>
      <button><img class="google" src="../assets/images/google.png" alt="Connect with google" width="25"/>Continue with Google</button>
      <p>------------- or Sign in with Email ------------- </p>
      <div class="error" v-if="error">
        <p>Error: Your credentials are incorrect, please try again...</p>
      </div>
      <div class="success" v-if="success">
        <p>Success: Connecting...</p>
      </div>
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
import axios from 'axios'

export default {
  name: "Login",
  data: function () {
    return {
      email: null,
      password: null,
      error: false,
      success: false
    }
  },
  methods: {
    login: async function () {
      this.error = false;
      this.success = false;

      const req = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BACK}/auth/login`,
        data: {
          email: this.email,
          password: this.password
        }
      })

      const data = req.data;

      if (!data.error) {
        this.success = true;
        window.location.replace(`${import.meta.env.VITE_APP}?token=${data.token}`);
      } else {
        this.error = true;
      }
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
