var express = require('express');
var config = require('./config/index');
var axios = require('axios');
var process = require('process')
var app = express();
var apiRoutes = express.Router();
apiRoutes.get('/api/getDiscList',(req,res)=>{
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query  //这是请求的query
  }).then((response) => {
    //response是api地址返回的，数据在data里。
    res.json(response.data)
  }).catch((e) => {
    console.log(e);
  })
});
apiRoutes.get('/api/lyric',(req,res)=>{
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query  //这是请求的query
  }).then((response) => {
    //response是api地址返回的，数据在data里。
    var ret = response.data;
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^(]+})\)$/;
      var matches = ret.match(reg);
      if (matches) {
        ret = JSON.parse(matches[1]);
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e);
  })
});
apiRoutes.get('/api/getSongList', function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
});
apiRoutes.get('/api/search', function (req, res) {
  var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
});
app.use('/api', apiRoutes);

var port = process.env.PORT || config.build.port
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('listen to http://localhost:' + port + '\n');
});
