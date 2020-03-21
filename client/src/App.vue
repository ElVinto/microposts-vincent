<template>
  <div id="app">
    
    <PostComponent />
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg = "Hello World welcome to Vue" /> -->
  </div>
</template>

<script>
import PostComponent from './components/PostComponent.vue';
//  import HelloWorld from './components/HelloWorld.vue' 

export default {
  name: 'App',
  components: {
    PostComponent
    // ,HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
