// seajs 的简单配置
seajs.config({
    base: "./assets/js/seajs/",
    alias: {
      "modulec": "module-c.js"
    }
})
  
// 加载入口模块
seajs.use("./assets/js/seajs/seajs-main")