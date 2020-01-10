<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control class="tab-control" :titles="['流行','新款','精选']"
                 @tabClick="tabClick" ref="tabControl1" v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll"
            :probe-type="3" @scroll="contentScroll"
            :pull-up-load="true" @pullingUp="loadeMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control class="tab-control" ref="tabControl2" :titles="['流行','新款','精选']" @tabClick="tabClick"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>
<script>
  import {getHomeMultidata, getHomeGoods} from 'network/home'

  import HomeSwiper from './childComps/HomeSwiper.vue'
  import RecommendView from './childComps/RecommendView.vue'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabcontrol/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'

  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import {debounce} from 'common/utils'

  export default {
    name: 'Home',
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0

      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed() {
      console.log('home destroyed');
    },
    activated() {
      console.log("home enter,设置位置")
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
//      console.log('home leave,记录位置')
      this.saveY = this.$refs.scroll.getScrollY()
    },
    created() {
      this.getHomeMultidata()
//      请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      this.tabClick(0)
      const refresh = debounce(this.$refs.scroll.refresh, 50);
      this.$bus.$on('itemImageLoad', () => {
        refresh()
      })
    },
    methods: {
      //      事件监听相关的方法
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
//        让两个tabControl的currentIndex保持一致
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
//      回到底部的事件 scrollTo(X,Y,延迟时间)滚动到指定的位置
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
// >1000显示     滚动到一定临界值的时候回到顶部按钮显示或者隐藏
      contentScroll(position) {
//        判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000;
//        决定tabControl是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
//加载更多
      loadeMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
//      网络请求相关的方法
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
//        this.goods[type].page=0 要请求的是第一页
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
//          console.log(res)
//          将拿到的数据保存到data的数组中
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1
//          继续上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      },

    }
  }

</script>
<style scoped>
  #home {
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /*nav固定在头部*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /*.content{*/
  /*height: calc(100% - 93px);*/
  /*overflow: hidden;*/
  /*margin-top: 44px;*/
  /*}*/
</style>
