<template>
  <div class="bottom-menu">
    <check-button class="select-all" v-model="isSelectAll" @checkBtnClick="checkBtnClick"></check-button>
    <span>全选</span>
    <span class="total-price">合计: ¥{{totalPrice}}</span>
    <span class="buy-product">去计算({{cartCount}})</span>
  </div>
</template>
<script>
  import CheckButton from './CheckButton'

  export default {
    name: 'CartBottomBar',
    components: {
      CheckButton,
    },
    computed: {
      cartCount() {
//        Filter中的回调函数有一个要求：必须返回一个Boolean值。当返回true时，函数内部会自动将这次回调的n加入到新的数组中。
// 当返回false时，函数内部会过滤掉这次的n.filter()返回的是一个数组
        return this.$store.getters.cartList.filter(item => item.checked).length
      },
      cartList() {
        return this.$store.getters.cartList
      },
      totalPrice() {
        const cartList = this.$store.getters.cartList;
        return cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {//reduce对数组中所有的内容进行汇总
          return preValue + item.count * item.price
        }, 0).toFixed(2)
      },
      isSelectAll(){
        if(this.$store.getters.cartList.length === 0){
          return false
        }
//        cartList.find(item => item.checked === false)或者这样写 cartList.find(item => !item.checked)
// 找到cartList数组中没有选中的元素然后和undefined进行对比。如果===undefined就返回true，否则就返回false。’
// 也就是如果存在没有选中的的元素就返回false，如果不存在没有选中的元素就返回true，即全都选中了（则全选勾上）。
        return this.$store.getters.cartList.find(item => !item.checked) === undefined;

      }
    },
    methods:{
      checkBtnClick(){
// 1.判断是否有未选中的按钮
        let isSelectAll = this.$store.getters.cartList.find(item => !item.checked);

        // 2.有未选中的内容, 则全部选中
        if (isSelectAll) {
          this.$store.state.cartList.forEach(item => {
            item.checked = true;
          });
        } else {
          this.$store.state.cartList.forEach(item => {
            item.checked = false;
          });
        }
      }
    }
  }
</script>
<style scoped>
  .bottom-menu {
    width: 100%;
    height: 44px;
    background-color: #eee;
    position: fixed;
    bottom: 49px;
    left: 0;
    box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
    font-size: 14px;
    color: #888;
    line-height: 44px;
    padding-left: 35px;
    box-sizing: border-box;
  }

  .bottom-menu .select-all {
    position: absolute;
    line-height: 0;
    left: 12px;
    top: 13px;
  }

  .bottom-menu .total-price {
    margin-left: 15px;
    font-size: 16px;
    color: #666;
  }

  .bottom-menu .buy-product {
    background-color: orangered;
    color: #fff;
    width: 100px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    float: right;
  }
</style>
