const express = require('express')
const path = require('path')
const proxy = require('http-proxy-middleware');
var fs = require('fs');
const indexRouter = require('./routes/index');
const app = express()

app.use('/', indexRouter)

//例如：http://localhost:3000/static/js/app.js
app.use('/static', express.static(path.join(__dirname, 'public')))

/// 设置代理
//appkey是京东万象API中的菜谱大全的开发者秘钥，在https://wx.jdcloud.com/market/datas/26/11072注册即可获取开发者秘钥
var appkey = "";
var proxySearchPath = "https://way.jd.com/jisuapi/search?appkey=" + appkey + "&";
var proxyRecipeClassPath = "https://way.jd.com/jisuapi/recipe_class?appkey=" + appkey + "&";
var proxyByClassPath = "https://way.jd.com/jisuapi/byclass?appkey=" + appkey + "&";
var proxydetailsPath = "https://way.jd.com/jisuapi/detail?appkey=" + appkey + "&";
app.use('/apis/search', proxy({
  target: proxySearchPath,
  changeOrigin: true,
  pathRewrite: {
    '^/apis': '/'
  },
  timeout: 2000
}));
app.use('/apis/recipeClass', proxy({
  target: proxyRecipeClassPath,
  pathRewrite: {
    '^/apis': '/'
  },
  changeOrigin: true,
  timeout: 2000
}));
app.use('/apis/searchByClass', proxy({
  target: proxyByClassPath,
  pathRewrite: {
    '^/apis': '/'
  },
  changeOrigin: true,
  timeout: 2000
}));
app.use('/apis/proxydetails', proxy({
  target: proxydetailsPath,
  pathRewrite: {
    '^/apis': '/'
  },
  changeOrigin: true,
  timeout: 2000
}));
//处理 404 响应
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})
//设置一个错误处理器
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

var server = app.listen(8081, "127.0.0.1", function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
  //注：内网访问时，把app.listen(8081, "127.0.0.1", function () {})中的第二个参数删除。
  //console.log("内网应用实例，访问地址为 http://xxx.xxx.xx.x:" + port); 
})