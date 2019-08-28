// seajs 的简单配置
seajs.config({
    base: "./assets/js/umd-simple/",
    alias: {
      "umd": "umd-module.js"
    }
})
  
  // 加载入口模块
seajs.use("./assets/js/umd-simple/umd-main-seajs")