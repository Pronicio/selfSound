<template>
  <h1>404</h1>
</template>

<script>

export default {
  name: "Home",
  data: function () {
    return {}
  },
  methods: {},
  mounted() {
    document.title = 'SelfSound - 404'
  }
}

</script>


<style scoped lang="scss">

h1 {
  color: var(--color);
  margin: 0 auto;
  position: relative;
  top: 17vh;
  left: 25vw;
  font-size: 15rem;
}

</style>
