// seajs 的简单配置
seajs.config({
    base: "./assets/js/umd-dep/",
    alias: {
      "umd": "umd-module.js",
      "depModule": "umd-module-depended.js"
    }
})
  
  // 加载入口模块
seajs.use("./assets/js/umd-dep/umd-main-seajs")