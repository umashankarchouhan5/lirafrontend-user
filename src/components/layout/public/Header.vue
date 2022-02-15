<template>
  <header :class="$style.header">
    <router-link :class="$style.logo" to="/">
      <img src="../../../assets/images/lira-logo-web.png" alt="LiRA Logo" />
    </router-link>
  </header>
</template>

<script>
export default {
  name: "PublicHeader"
};
</script>

<style lang="scss" module>
.header {
  position: relative;
  background: #eeedf2;
  height: 52px;
  border: 1px solid transparent;
  z-index: 1;
  box-shadow: 0 12px 16px rgba(187, 186, 189, 0.53);
}
.logo {
  float: left;
  padding: 10px 0 0 15px;
  img {
    max-width: 110px;
    display: block;
  }
}
</style>
