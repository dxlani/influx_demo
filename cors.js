//跨域白名单
const express = require('express');
const app = express();
    var cors=function(){
        isOriginAllowed=(origin, allowedOrigin)=>{
            var reg=new RegExp(allowedOrigin.join("|"),"ig");   //动态生成一个正则表达式
            // var domain=str.match(reg);   //匹配 正则
            return reg.test(origin)
           }
         
        const ALLOW_ORIGIN = [ // 跨域白名单
         'dingxiaolin.com',
         'sowl.cn',
         'jfry.cn',
         '127.0.0.1',
         'localhost'
        ]; 
        /**
         * 允许跨域
         */
        app.use((req, res, next) => {
              let reqOrigin = req.headers.origin; // request响应头的origin属性
                if(isOriginAllowed(reqOrigin, ALLOW_ORIGIN)) {
                    res.header("Access-Control-Allow-Origin", reqOrigin);
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization,Accept,X-Requested-With,X-Request-Id");
                    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
                    res.setHeader('Content-Type','text/javascript;charset=UTF-8'); //解决res乱码
                    next();
                  } else {
                      console.log('bbbbbbbbb')
                    res.setHeader('Content-Type','text/javascript;charset=UTF-8'); //解决res乱码
                    next();
                    }
        });
    }

    module.exports = cors;