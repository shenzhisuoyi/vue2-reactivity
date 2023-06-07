class Observer {
  constructor(data) {
    this.walk(data);
  }
  walk(data) {
    if (!data || typeof data !== "object") {
      return;
    }
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }
  // 把数据变成响应式
  defineReactive(obj, key, value) {
    let that = this;
    // 在使用前先创建Dep类
    let dep = new Dep();
    // 将对象中的属性也变成响应式
    this.walk(value);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set(newValue) {
        if (newValue === value) {
          return;
        }
        value = newValue;
        // 新增加的数据也应该是响应式的
        that.walk(newValue);
        // 发送通知，更新视图
        dep.notify();
      },
    });
  }
}
