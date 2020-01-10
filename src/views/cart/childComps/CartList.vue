<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <div>
        <cart-list-item v-for="(item,index) in cartList" :key="index" :item-info="item"></cart-list-item>
      </div>
    </scroll>
  </div>
</template>
<script>
  import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from './CartListItem.vue'

  export default {
    name: 'CartList',
    components: {
      Scroll, CartListItem
    },
    props:{
      cartList:{
        type:Array,
        default(){
          return []
        }
      }
    },
// activated()：在vue对象存活的情况下，进入当前存在activated()函数的页面时，一进入页面就触发；可用于初始化页面数据等
    activated(){//添加商品的时候要进行重新获取高度，不然不能进行滚动
      this.$refs.scroll.refresh()
    }
  }
</script>
<style scoped>
  .cart-list {
    height: calc(100% - 44px - 49px - 44px);
  }
  .content {
    height: 100%;
    overflow: hidden;
  }
</style>
