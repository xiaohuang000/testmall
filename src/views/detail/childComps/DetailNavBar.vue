<template>
  <div>
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title">
        <div v-for="(item,index) in titles" class="title-item"
             :class="{active:index===currentIndex}" @click="titleClick(index)">
          {{item}}
        </div>
      </div>
    </nav-bar>
  </div>
</template>
<script>
  import NavBar from 'components/common/navbar/NavBar'

  export default {
    name: 'DetailNavBar',
    components: {
      NavBar
    },
    data() {
      return {
        titles: ['商品', '参数', '评论', '推荐'],
        currentIndex: 0
      }
    },
    methods: {
      backClick() {
        this.$router.back()
      },
      titleClick(index) {
        this.currentIndex = index;
//        监听标题的点击，发射事件给父组件,并将当前点击的下标传递过去
        this.$emit('titleClick',index)
      }
    }
  }

</script>
<style>
  .back img {
    margin-top: 12px;
  }

  .title {
    display: flex;
    font-size: 13px;
  }

  .active {
    color: var(--color-high-text)
  }

  .title-item {
    flex: 1;
  }

</style>
