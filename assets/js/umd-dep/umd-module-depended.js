(function(root, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory)
    } else if (typeof define === 'function' && define.cmd) {
        define(function(require, exports, module) {
            module.exports = factory()
        })
    } else {
        root.depModule = factory();
    }
}(this, function() {
    return {
        name: '我是一个被依赖的umd模块'
    }
}))