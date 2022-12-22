<template>
  <Header/>
  <Sidebar/>
  <main>
    <router-view/>
  </main>
  <Trackbar/>
  <Radio/>
  <div id="context-menu">
    <div class="item">
      <div id="like"></div>
      J'aime
    </div>
    <div class="item">
      <div id="add-to-queue"></div>
      Lire ensuite
    </div>
    <div class="item">
      <div id="add-to-playlist"></div>
      Ajouter à une playlist
    </div>
    <div class="item">
      <div id="album"></div>
      Voir l'album
    </div>
    <div class="item">
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

export default {
  name: "Home",
  components: {
    Header, Sidebar, Trackbar, Radio
  },
  mounted() {
    const scope = document.querySelector("body");

    scope.addEventListener("contextmenu", (event) => this.ctxMenu(event));
    scope.addEventListener("click", (e) => this.activeMenu(e));
  },
  methods: {
    activeMenu: function (e) {
      const contextMenu = document.getElementById("context-menu");
      // ? close the menu if the user clicks outside of it
      if (e.target.offsetParent != contextMenu) {
        contextMenu.classList.remove("visible");
      }
    },
    ctxMenu: function (event) {

      //TODO: Detect if track !!! 
      event.path.includes(value => {
        console.log("vv", value)
      })

      const contextMenu = document.getElementById("context-menu");

      event.preventDefault();

      const { clientX: mouseX, clientY: mouseY } = event;
      const { normalizedX, normalizedY } = this.normalizePozition(mouseX, mouseY);

      contextMenu.classList.remove("visible");

      contextMenu.style.top = `${normalizedY}px`;
      contextMenu.style.left = `${normalizedX}px`;

      setTimeout(() => {
        contextMenu.classList.add("visible");
      });
    },
    normalizePozition: function (mouseX, mouseY) {
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
    }
  }
}

</script>

<style lang="scss">
@import './assets/style/style.scss';
</style>
