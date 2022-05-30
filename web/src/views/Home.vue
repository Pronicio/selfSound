<template>
  <h1>SelfSound : Hello World</h1>
</template>

<script>
export default {
  name: "Home",
  data: function () {
    return {};
  },
  mounted() {
    document.title = "SelfSound - Home";
  },
};
</script>

<style scoped lang="scss">
@import "../assets/style/pages/home.scss";
</style>
