<template>
  <div id="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartCount}})</div>
    </nav-bar>
    <cart-list class="cart-list" :cart-list="cartList"></cart-list>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>
<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartList from './childComps/CartList.vue'
  import CartBottomBar from './childComps/CartBottomBar.vue'

  export default {
    name: 'Cart',
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      cartList() {
        return this.$store.getters.cartList
      },
      cartCount() {
        return this.$store.getters.cartCount
      }
    }
  }
</script>
<style scoped>
  #cart {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }

  /*.cart-list {*/
  /*position: absolute;*/
  /*top: 44px;*/
  /*bottom: 49px;*/
  /*width: 100%;*/
  /*}*/


</style>
