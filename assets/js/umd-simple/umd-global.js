window.addEventListener('load', function() {
    document.querySelector('h2').innerText = '普通方式引用了umd模块，将umd模块挂载在全局对象window下'
    document.querySelector('#content').innerText = umdModule.name
    console.log('普通方式引用了umd模块，将umd模块挂载在全局对象window下', umdModule)
})
