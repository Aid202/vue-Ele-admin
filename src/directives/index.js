// 负责管理所有自定义指令

export const imageerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // dom 表示当前指令作用的dom对象
    // dom 认为此时就是图片
    // 当图片有地址，但地址未加载成功，
    // 会报错，触发 => onerror
    dom.onerror = function() {
      // 当图片出现异常时，会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value
    }
  }
}

