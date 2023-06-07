// 发布者，作用是收集依赖（watcher），在getter中收集依赖，在setter中通知依赖
class Dep {
  constructor() {
    this.sbus = [];
  }
  // 保存订阅者
  addSub(sub) {
    this.sbus.push(sub);
  }
  // 通知订阅者
  notify() {
    this.sbus.forEach((sub) => {
      // 执行更新
      sub.update();
    });
  }
}
