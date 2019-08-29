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
    if (document) {
        // 判断一下，因为nodejs没有dom的
        if (document.querySelector('#content2')) {
            document.querySelector('#content2').innerText = '我调用了依赖模块：' + depModule.name
        } else {
            window.addEventListener('load', function() {
                document.querySelector('#content2').innerText = '我调用了依赖模块：' + depModule.name
            })
        }
    }
    return {
        name: '我自己是一个umd模块'
    }
}))