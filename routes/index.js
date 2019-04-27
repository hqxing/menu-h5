var express = require('express')
const path = require('path')
//const api = require('./api')
const router = express.Router()

//console.log(api.search);
const viewsPath = path.join(__dirname, '../views');
//首页发出get请求，服务响应重定向到index
router.get('/', (req, res) => res.redirect('/views/index'))
router.get('/views/classify', function (req, res) {
  res.sendFile(path.join(viewsPath, 'classify.html'));
})
router.get('/views/detail', function (req, res) {
  var id = req.params.id;
  res.sendFile(path.join(viewsPath, 'detail.html'));
})
router.get('/views/index', function (req, res) {
  res.sendFile(path.join(viewsPath, 'index.html'));
})
router.get('/views/list', function (req, res) {
  res.sendFile(path.join(viewsPath, 'list.html'));
})
router.get('/views/about', function (req, res) {
  res.sendFile(path.join(viewsPath, 'about.html'));
})
/* router.get('/:name', function (req, res) {
  res.sendFile(path.join(viewsPath, req.params.name))
}) */
module.exports = router