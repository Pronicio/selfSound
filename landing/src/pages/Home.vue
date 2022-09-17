<template>
  <section>
    <h1>Hello SelfSound !</h1>
  </section>
</template>

<script setup>
import { useHead } from '@vueuse/head'
useHead({
  title: 'SelfSound - Home',
})
</script>

<style scoped lang="scss">
@import '../assets/style/home.scss';
</style>
