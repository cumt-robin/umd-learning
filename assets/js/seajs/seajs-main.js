define(function(require, exports, module) {
    var modulec = require('modulec');

    document.querySelector('#btn-calc').addEventListener('click', function() {
        var num1 = document.querySelector('#num1');
        var num2 = document.querySelector('#num2');
        var result = document.querySelector('#result');
        result.innerText = Number(num1.value) + Number(num2.value)
    })
})