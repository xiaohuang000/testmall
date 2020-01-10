<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="selectIndex"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3"
            :data="[topImages,goods,shop,detailInfo,paramInfo,goodsList]">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="param"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="goodsList" ref="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <toast ref="toast"/>
  </div>
</template>
<script>
  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from 'network/detail'
  import DetailNavBar from './childComps/DetailNavBar.vue'
  import DetailSwiper from './childComps/DetailSwiper.vue'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo.vue'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
  import DetailParamInfo from './childComps/DetailParamInfo.vue'
  import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
  import DetailBottomBar from './childComps/DetailBottomBar.vue'

  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'
  import {backTopMixin} from '@/common/mixin'
  import Toast from 'components/common/toast/Toast'

  export default {
    name: 'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      BackTop,
      Scroll,
      Toast
    },
    mixins: [backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        goodsList: [],
        themeTops: [],
        currentIndex: 0,

      }
    },
    created() {
//      1.传入保存的iid
      this.iid = this.$route.params.iid
//      2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        console.log(res)
        //1.获取顶部的图片轮播数据
        const data = res.result;
        this.topImages = data.itemInfo.topImages;
        //2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)
//        4.保存商品的详情信息
        this.detailInfo = data.detailInfo;
//        5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
//        6.保存评论数据
        if (data.rate.list) {
          this.commentInfo = data.rate.list[0]
        }
      })
//      3.请求推荐数据
      getRecommend().then(res => {
        this.goodsList = res.data.list
      })
    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh()
//        图片加载完获得的位置才是正确的
        this.themeTops = []
        this.themeTops.push(0)
        this.themeTops.push(this.$refs.param.$el.offsetTop)
        this.themeTops.push(this.$refs.comment.$el.offsetTop)
        this.themeTops.push(this.$refs.recommend.$el.offsetTop)
        this.themeTops.push(Number.MAX_VALUE)
      },
      //      滚动到对应的位置(就需要知道对应的offsetTop)
      selectIndex(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTops[index], 500)
      },
      contentScroll(position) {
//        决定backTop按钮是否显示
        this.isShowBackTop = position.y <= -1000
//        监听滚动到某个主题
        this._listenScrollTheme(-position.y)
      },
      _listenScrollTheme(position) {
//        console.log('position:'+position)
        let length = this.themeTops.length;
        for (let i = 0; i < length; i++) {
          let ipos = this.themeTops[i]
          if (position >= ipos && position < this.themeTops[i + 1]) {
            if (this.currentIndex !== i) {
              this.currentIndex = i
            }
            break
          }
        }
      },
      addToCart(){
        const obj={};
//        对象信息
        obj.iid=this.iid;
        obj.imgURL=this.topImages[0];
        obj.title=this.goods.title;
        obj.desc=this.goods.desc;
        obj.price=this.goods.realPrice;
//        添加到store
//        this.$store.commit('addCart',obj)
//        3.添加到购物车成功（弹窗Toast）
// 这里就可以做个回调了。加入购物车成功了就可以弹出一个toast(弹窗)
        this.$store.dispatch('addCart',obj).then(()=>{
//          console.log('加入购物车成功')
          this.$toast({message:'加入购物车成功'})
        })
      }
    }
  }
</script>
<style scoped>
  /*设置属性将底部的导航盖住*/
  #detail {
    position: relative;
    z-index: 9;
    background: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px);
  }
</style>
