var express = require('express');
var router = express.Router();

const axios = require("axios");
const Cache = require("node-cache");
const cache = new Cache({ stdTTL: 600, checkperiod: 600 })
const likesCache = new Cache({ stdTTL: 600, checkperiod: 600 })

router.get('/', function(req, res, next) {
  if(cache.get("count")) return res.send({count : cache.get("count")})
  axios.get(`https://api.untappd.com/v4/brewery/info/${process.env.UNTAPPD_BREWERY_ID}?client_id=${process.env.UNTAPPD_CLIENT_ID}&client_secret=${process.env.UNTAPPD_CLIENT_SECRET}`)
      .then(response => {
        cache.set("count",response.data.response.brewery.stats.total_count);
        res.send({count : cache.get("count")})
      })
});

router.get('/likes', function(req, res, next) {
  if(likesCache.get("count")) return res.send({likes : likesCache.get("count")})
  axios.get(`https://graph.facebook.com/v9.0/${process.env.FACEBOOK_PAGE_ID}/insights/page_fans?access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`)
      .then(response => {
          const data = response.data.data[0];
          console.log(data.values);
          console.log(data.values.length);
          console.log(data.values[data.values.length -1]);
          likesCache.set("count",data.values[data.values.length -1].value);
        res.send({count : likesCache.get("count")})
      })
});

module.exports = router;
