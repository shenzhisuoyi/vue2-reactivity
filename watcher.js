// 订阅者，作用是数据变化后触发依赖更新视图
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    // data中属性名称
    this.key = key;
    // 回调函数，负责更新视图
    this.cb = cb;
    Dep.target = this;
    // 获取更新前的旧值
    // 这里的vm[key]被Observer中的setter捕获，所以下一步需要对Dep.target初始化
    this.oldValue = vm[key];
    Dep.target = null;
  }
  // 更新操作
  update() {
    let newValue = this.vm[this.key];
    if (newValue === this.oldValue) {
      return;
    }

    this.cb(newValue);
  }
}
