// 0.创建Vue构造函数
class Vue {
  constructor(options) {
    // 1.接收传递过来的选项，并保存
    this.$options = options || {};
    // 获取选项参数中的data
    this.$data = options.data || {};
    // el传过来的可能是字符串'#app'，也可能是一整个节点数据
    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el;
    // 2.把data转换成getter/setter，并注入到Vue实例中
    this._proxyData(this.$data);
    // this.$data = this._proxyData(this.$data)

    // 3.调用Observer对象，监听数据的变化（把$data数据变成响应式）
    new Observer(this.$data);

    // 4.调用compiler解析指令/差值表达式
    new Compiler(this);
  }
  _proxyData(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set(newValue) {
          if (data[key] === newValue) {
            return;
          }
          data[key] = newValue;
        },
      });
    });
  }
}
