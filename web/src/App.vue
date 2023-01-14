<template>
  <Header/>
  <Sidebar/>
  <main>
    <router-view/>
  </main>
  <Trackbar/>
  <Radio/>
  <div id="context-menu">
    <div class="item" @click="action('like')">
      <div id="like"></div>
      J'aime
    </div>
    <div class="item" @click="action('add-to-queue')">
      <div id="add-to-queue"></div>
      Lire ensuite
    </div>
    <div class="item" @click="action('add-to-playlist')">
      <div id="add-to-playlist"></div>
      Ajouter à une playlist
    </div>
    <div class="item" @click="action('album')">
      <div id="album"></div>
      Voir l'album
    </div>
    <div class="item" @click="action('artist')">
      <div id="artist"></div>
      Voir l'artiste
    </div>
  </div>
</template>

<script>
import Header from './components/partials/Header.vue'
import Sidebar from './components/partials/Sidebar.vue'
import Trackbar from './components/music/Trackbar.vue'
import Radio from './components/music/Radio.vue'
import { getTrackFromId, getYoutubeVideoFromProvider } from "@/api";
import { useStore } from "@/store/main";

export default {
  name: "Home",
  components: {
    Header, Sidebar, Trackbar, Radio
  },
  data: function () {
    return {
      trackObject: null
    }
  },
  mounted() {
    const scope = document.querySelector("body");

    scope.addEventListener("contextmenu", (event) => this.ctxMenu(event));
    scope.addEventListener("click", (e) => this.activeMenu(e));
  },
  methods: {
    activeMenu: function (e, force) {
      const contextMenu = document.getElementById("context-menu");

      if (force) return contextMenu.classList.remove("visible");

      if (e.target.offsetParent != contextMenu) {
        contextMenu.classList.remove("visible");
      }
    },
    ctxMenu: function (event) {
      const contextMenu = document.getElementById("context-menu");
      contextMenu.classList.remove("visible");

      const isTrack = event.path.find(el => el.className === "track")
      if (!isTrack) return;

      this.trackObject = isTrack

      event.preventDefault();

      const { clientX: mouseX, clientY: mouseY } = event;
      const { normalizedX, normalizedY } = this.normalizePosition(mouseX, mouseY);

      contextMenu.style.top = `${normalizedY}px`;
      contextMenu.style.left = `${normalizedX}px`;

      setTimeout(() => {
        contextMenu.classList.add("visible");
      });
    },
    normalizePosition: function (mouseX, mouseY) {
      const contextMenu = document.getElementById("context-menu");
      const scope = document.querySelector("body");

      let {
        left: scopeOffsetX,
        top: scopeOffsetY,
      } = scope.getBoundingClientRect();

      scopeOffsetX = scopeOffsetX < 0 ? 0 : scopeOffsetX;
      scopeOffsetY = scopeOffsetY < 0 ? 0 : scopeOffsetY;

      const scopeX = mouseX - scopeOffsetX;
      const scopeY = mouseY - scopeOffsetY;

      const outOfBoundsOnX = scopeX + contextMenu.clientWidth > scope.clientWidth;
      const outOfBoundsOnY = scopeY + contextMenu.clientHeight > scope.clientHeight;

      let normalizedX = mouseX;
      let normalizedY = mouseY;

      if (outOfBoundsOnX) {
        normalizedX = scopeOffsetX + scope.clientWidth - contextMenu.clientWidth;
      }

      if (outOfBoundsOnY) {
        normalizedY = scopeOffsetY + scope.clientHeight - contextMenu.clientHeight;
      }

      return { normalizedX, normalizedY };
    },
    action: function (name) {
      switch (name) {
        case 'like':
          //TODO: like
          break;
        case 'add-to-queue':
          this.addToQueue(this.trackObject.id)
          this.eventBus.emit('add-to-queue', "track")
          break;
        case 'add-to-playlist':
          //TODO: add-to-playlist
          break;
        case 'album':
          this.$router.push({ name: 'Album', params: { query: this.trackObject.querySelector("img").id } })
          break;
        case 'artist':
          this.$router.push({ name: 'Artist', params: { query: this.trackObject.querySelector(".artist").id } })
          break;
      }

      this.activeMenu(null, true)
    },
    addToQueue: async function (id) {
      const data = await getTrackFromId(id)
      const track = await getYoutubeVideoFromProvider(data);

      this.store.queue.unshift(track)
      this.store.saveQueue();
    },
  },
  setup() {
    const store = useStore()
    return {
      store
    }
  }
}

</script>

<style lang="scss">
@import './assets/style/style.scss';
</style>
