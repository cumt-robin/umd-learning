define(function(require, exports, module) {
    var umdModule = require('umd');
    document.querySelector('h2').innerText = 'sea.js方式引用了umd模块'
    document.querySelector('#content').innerText = umdModule.name
    console.log('sea.js方式引用了umd模块', umdModule)
});