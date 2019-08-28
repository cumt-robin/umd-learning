require.config({
    baseUrl: './assets/js/requirejs/',
    paths: {
        modulea: 'module-a',
        moduleb: 'module-b'
    }
})

require(["modulea"], function(modulea) {
    var btnNode = document.querySelector('#btn-load');
    var node1 = document.createElement('span');
    node1.innerText = '模块A已经加载！'
    btnNode.insertAdjacentElement('beforebegin',  node1)
    btnNode.addEventListener('click', function() {
        require(["moduleb"], function(moduleb) {
            var node2 = document.createElement('span');
            node2.innerText = '模块B已经加载！'
            btnNode.insertAdjacentElement('afterend',  node2)
        });
    })
});