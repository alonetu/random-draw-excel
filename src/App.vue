<template>
  <div id="app">
    <random-draw />
  </div>
</template>

<script>
import RandomDraw from './components/random-draw.vue'

export default {
  name: 'App',
  components: {
    RandomDraw
  }
}
</script>

<style lang="scss">
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100%;
  font-size: 18px;
  // background-color: #2d3436;
  font-family: "HelveticaNeue", Helvetica, "PingFangSC", "HiraginoSansGB",
    "MicrosoftYaHei", "微软雅黑", Arial, sans-serif;
}
</style>
