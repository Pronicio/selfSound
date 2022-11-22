<template>
  <section>
    <input type="text" v-model="code">
    <button @click="start">Get stream</button>
    <audio :src="url" controls autoplay></audio>
  </section>
</template>

<script>
import { getStream } from "./api.js";

export default {
  data: function () {
    return {
      code: "CVXOJ-CBcJQ",
      url: null
    }
  },
  methods: {
    async start() {
      const data = await getStream(this.code)

      if (data.type === "stream") {
        this.url = data.url;
      }
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  justify-content: center;
  align-content: center;
  height: 100vh;
  padding: 3rem;
}

section {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

audio {
  width: 100%;
}
</style>
