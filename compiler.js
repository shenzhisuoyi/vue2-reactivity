class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.compile(this.el);
  }
  // 编译模板
  compile(el) {
    // 获取el的所有子节点
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      if (this.isTextNode(node)) {
        // 处理文本节点
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node);
      }
      // 判断node是否还有子节点
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }
  // 编译文本节点，处理差值表达式
  compileText(node) {
    let reg = new RegExp(/\{\{(.+)\}\}/);
    let value = node.textContent;
    if (value.match(reg)) {
      let key = reg.exec(value)[1];
      // 使用Vue实例上的值替换掉节点的内容
      node.textContent = value.replace(reg, this.vm[key]);
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue;
      });
    }
  }
  // 编译元素节点，处理指令
  compileElement(node) {
    Array.from(node.attributes).forEach((attr) => {
      // 获取属性的名字
      let attrName = attr.name;
      // 判断是否是指令
      if (this.isDirective(attrName)) {
        // 有可能是， v-text：text，v-model：model
        attrName = attrName.substr("2");
        // 获取指令中的值，v-text：msg，v-model：count
        let key = attr.value;
        this.update(node, key, attrName);
      }
    });
  }
  // 更新展示
  update(node, key, attrName) {
    let updateFn = this[`${attrName}Updater`];
    // 需要改变this的指向
    updateFn && updateFn.call(this, node, this.vm[key], key);
  }
  // 处理v-text指令
  textUpdater(node, value, key) {
    node.textContent = value;
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue;
    });
  }
  // 处理v-model指令
  modelUpdater(node, value, key) {
    node.value = value;
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue;
    });
    // 数据双向绑定
    node.addEventListener("input", () => {
      this.vm[key] = node.value;
    });
  }
  // 判断元素的属性是否为指令
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }
  // 判断节点是否为文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }
  // 判断节点是否为元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
