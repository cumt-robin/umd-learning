# 学习UMD

## 介绍

这个仓库记录了一些关于`javascript UMD`模块规范的`demo`，对我学习`UMD`规范有了很大帮助，希望也能帮助到你。

## 回顾

之前也写了几篇关于`javascript`模块的博客，链接如下：

- [回头再看JS模块化编程](http://hexo.wbjiang.cn/%E5%9B%9E%E5%A4%B4%E5%86%8D%E7%9C%8BJS%E6%A8%A1%E5%9D%97%E5%8C%96%E7%BC%96%E7%A8%8B.html)
- [回头再看JS模块化编程之AMD](http://hexo.wbjiang.cn/%E5%9B%9E%E5%A4%B4%E5%86%8D%E7%9C%8BJS%E6%A8%A1%E5%9D%97%E5%8C%96%E7%BC%96%E7%A8%8B%E4%B9%8BAMD.html)
- [sea.js的同步魔法](http://hexo.wbjiang.cn/sea-js%E7%9A%84%E5%90%8C%E6%AD%A5%E9%AD%94%E6%B3%95.html)

近几天准备总结一下`javascript`模块的知识点，所以建了这个[Git仓库](https://github.com/cumt-robin/umd-learning)，如果能帮助到您，麻烦点个`star`哦，非常感谢！

这篇博客主要说下自己关于`UMD`的一点认知和思考，从实现一个简单的`UMD`模块，再到实现一个有依赖关系的`UMD`模块，整个过程加深了我对`UMD`模块的理解。

## 什么是UMD

所谓`UMD (Universal Module Definition)`，就是一种`javascript`通用模块定义规范，让你的模块能在`javascript`所有运行环境中发挥作用。

## 简单UMD模块的实现

实现一个`UMD`模块，就要考虑现有的主流`javascript`模块规范了，如`CommonJS`, `AMD`, `CMD`等。那么如何才能同时满足这几种规范呢？

首先要想到，模块最终是要导出一个对象，函数，或者变量。

而不同的模块规范，关于模块导出这部分的定义是完全不一样的。

因此，我们需要一种过渡机制。

首先，我们需要一个`factory`，也就是工厂函数，它只负责返回你需要导出的内容（对象，函数，变量等）。

我们从导出一个简单的对象开始。

```javascript
function factory() {
    return {
        name: '我是一个umd模块'
    }
}
```

### 全局对象挂载属性

假设不考虑`CommonJS`, `AMD`, `CMD`，仅仅将这个模块作为全局对象的一个属性应该怎么写呢？

```javascript
(function(root, factory) {
    console.log('没有模块环境，直接挂载在全局对象上')
    root.umdModule = factory();
}(this, function() {
    return {
        name: '我是一个umd模块'
    }
}))
```

我们把`factory`写成一个匿名函数，利用`IIFE`（立即执行函数）去执行工厂函数，返回的对象赋值给`root.umdModule`，这里的`root`就是指向全局对象`this`，其值可能是`window`或者`global`，视运行环境而定。

打开[效果页面链接](https://cumt-robin.github.io/umd-learning/umd-simple-used-by-global.html)（要看源码的话，点开[Git仓库](https://github.com/cumt-robin/umd-learning)），观察`Network`的文件加载顺序，可以看到，原则就是依赖先行。

![global调用UMD模块](http://qncdn.wbjiang.cn/global%E8%B0%83%E7%94%A8UMD%E6%A8%A1%E5%9D%97.png)

### 再进一步，兼容AMD规范

要兼容`AMD`也简单，判断一下环境，是否满足`AMD`规范。如果满足，则使用`require.js`提供的`define`函数定义模块。

```javascript
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // 如果环境中有define函数，并且define函数具备amd属性，则可以判断当前环境满足AMD规范
        console.log('是AMD模块规范，如require.js')
        define(factory)
    } else {
        console.log('没有模块环境，直接挂载在全局对象上')
        root.umdModule = factory();
    }
}(this, function() {
    return {
        name: '我是一个umd模块'
    }
}))
```

打开[效果页面链接](https://cumt-robin.github.io/umd-learning/umd-simple-used-by-requirejs.html)，可以看到，原则是调用者先加载，所依赖的模块后加载。

![requirejs调用UMD模块](http://qncdn.wbjiang.cn/requirejs%E8%B0%83%E7%94%A8UMD%E6%A8%A1%E5%9D%97.png)

### 起飞，直接UMD

同理，接着判断当前环境是否满足`CommonJS`或`CMD`规范，分别使用相应的模块定义方法进行模块定义。

```javascript
(function(root, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        console.log('是commonjs模块规范，nodejs环境')
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        console.log('是AMD模块规范，如require.js')
        define(factory())
    } else if (typeof define === 'function' && define.cmd) {
        console.log('是CMD模块规范，如sea.js')
        define(function(require, exports, module) {
            module.exports = factory()
        })
    } else {
        console.log('没有模块环境，直接挂载在全局对象上')
        root.umdModule = factory();
    }
}(this, function() {
    return {
        name: '我是一个umd模块'
    }
}))
```

最终，使用`require.js`, `sea.js`, `nodejs`或全局对象挂载属性等方式都能完美地使用`umd-module.js`这个模块，实现了大一统。

给个`sea.js`调用`UMD`的效果页面链接，[sea.js调用UMD模块](https://cumt-robin.github.io/umd-learning/umd-simple-used-by-seajs.html)

而`nodejs`调用`UMD`模块需要执行`node`命令，

```javascript
node umd-simple-used-by-nodejs
```

效果如下：

![nodejs调用umd模块](http://qncdn.wbjiang.cn/nodejs%E8%B0%83%E7%94%A8UMD%E6%A8%A1%E5%9D%97.png)

## 有依赖关系的UMD模块

当然，我们不能止步于此，模块会被调用，当然也会调用其他模块。因此我们还需要实现一个有依赖关系的`UMD`模块，来验证`UMD`规范的可行性。

### 全局对象挂载属性

这个简单，在`html`中你的模块前引入所依赖的模块即可。`umd-module-depended`和`umd-module`都是`UMD`模块，后者依赖前者。

[](https://github.com/cumt-robin/umd-learning)

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Test UMD</title>
        <!-- 依赖放前面 -->
        <script src="assets/js/umd-dep/umd-module-depended.js"></script>
        <script src="assets/js/umd-dep/umd-module.js"></script>
        <script src="assets/js/umd-dep/umd-global.js"></script>
    </head>
    <body>
        <h1>测试UMD模块</h1>
        <h2></h2>
        <p id="content"></p>
        <p id="content2"></p>
    </body>
</html>
```

点开[效果页面链接](https://cumt-robin.github.io/umd-learning/umd-dep-used-by-global.html)，看得更清楚明白！

### 兼容AMD规范

我们先在入口文件`umd-main-requirejs.js`中，定义好模块路径，方便调用。

```javascript
require.config({
    baseUrl: "./assets/js/umd-dep/",
    paths: {
        umd: "umd-module",
        depModule: "umd-module-depended"
    }
});
```

被依赖的模块`umd-module-depended`，只需要简单实现`UMD`规范即可。

而调用者`umd-module`，则需要做一些处理。按照`require.js`的规范来即可， `define`时，指定依赖的模块`depModule`，而匿名工厂函数需要在参数上接收依赖的模块`depModule`。

```javascript
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        console.log('是AMD模块规范，如require.js')
        define(['depModule'], factory)
    } else {
        console.log('没有模块环境，直接挂载在全局对象上')
        root.umdModule = factory(root.depModule);
    }
}(this, function(depModule) {
    console.log('我调用了依赖模块', depModule)
    // ...省略了一些代码，去代码仓库看吧
    return {
        name: '我自己是一个umd模块'
    }
}))
```

打开[效果页面链接](https://cumt-robin.github.io/umd-learning/umd-dep-used-by-requirejs.html)，看得更清楚明白！

### UMD依赖写法

同理，各种规范要求你怎么写模块依赖，你就怎么写就行。

```javascript
(function(root, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        console.log('是commonjs模块规范，nodejs环境')
        var depModule = require('./umd-module-depended')
        module.exports = factory(depModule);
    } else if (typeof define === 'function' && define.amd) {
        console.log('是AMD模块规范，如require.js')
        define(['depModule'], factory)
    } else if (typeof define === 'function' && define.cmd) {
        console.log('是CMD模块规范，如sea.js')
        define(function(require, exports, module) {
            var depModule = require('depModule')
            module.exports = factory(depModule)
        })
    } else {
        console.log('没有模块环境，直接挂载在全局对象上')
        root.umdModule = factory(root.depModule);
    }
}(this, function(depModule) {
    console.log('我调用了依赖模块', depModule)
	// ...省略了一些代码，去代码仓库看吧
    return {
        name: '我自己是一个umd模块'
    }
}))
```

给个`sea.js`调用的[示例链接](https://cumt-robin.github.io/umd-learning/umd-dep-used-by-seajs.html)。

而`nodejs`调用也是通过命令行测试，

```shell
node umd-dep-used-by-nodejs
```

效果如下：

![nodejs调用有依赖的UMD模块](http://qncdn.wbjiang.cn/nodejs%E8%B0%83%E7%94%A8%E6%9C%89%E4%BE%9D%E8%B5%96%E7%9A%84UMD%E6%A8%A1%E5%9D%97.png)

# 总结

以上实现了简单的`UMD`模块，也验证了`UMD`模块间存在依赖关系时的可行性。虽然本文是以简单对象导出为例，但足以作为我们深入`UMD`规范的起点，加油！

最后厚着脸皮求个`star`，[点亮我吧](https://github.com/cumt-robin/umd-learning)

------

扫一扫下方小程序二维码或搜索`Tusi博客`，即刻阅读最新文章！

![Tusi博客](http://qncdn.wbjiang.cn/Tusi%E5%8D%9A%E5%AE%A2.jpg)