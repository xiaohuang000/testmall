// const mutations = {
//   addCart(state, info) {
//     //查找之前数组中是否有该商品
//     const oldInfo = state.cartList.find(item => item.iid === info.iid)
//     //判断oldInfo,如果存在就加1,不存在就添加一个新的元素进数组 如果find()没有找到就返回undefined，找到就返回一个数组
//     // console.log("oldInfo"+oldInfo)
//     if (oldInfo) {
//       oldInfo.count += 1
//     } else {
//       info.count = 1;
//       info.checked = true
//       state.cartList.push(info)
//     }
//   }
// }
//方法2，使用actions
const mutations = {
  addCounter(state, info) {
    info.count++
  },
  addToCart(state, info) {
    info.checked = true
    state.cartList.push(info)
  }
}
export default mutations
