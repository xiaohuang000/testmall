const actions = {
  addCart(context, info) {
    // 1. 查看该商品是否已经添加到cartList中
    const oldInfo = context.state.cartList.find(item => item.iid === info.iid)
    //  2.如果oldInfo存在，那么原来的数量加1 否则就向数组中加入新的商品
    if (oldInfo) {
      context.commit('addCounter',oldInfo)
    }else{
      info.count=1;
      context.commit('addToCart',info)
    }
  }
}
export default actions
