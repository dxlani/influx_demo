const express = require('express');
const app = express();
const router = express.Router();
const server=require('http').Server(app);
const IO = require('socket.io');
const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.text());
//设置静态资源
app.use(express.static('./public'));
//路由
app.use('/', router);
module.exports=router;
//跨域
const cors=require ('./cors')
cors();
//influxDB
const Influx = require('influxdb-nodejs');
// const redis = require("redis"),
// redisClient = redis.createClient();
// redisClient.on("error", function (err) {
//   console.log("redisError " + err);
// });
// 创建socket服务
const socketIO = IO(server,{
    // path: '/',
    origins:'*:*',
    serveClient: true,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: true
  });

router.post('/wslogin', function (req, res) {
  var profile=req.body
  console.log('profile',profile)
  // 将用户信息加密在令牌内
  const jwtSecret="dingxiaolin_secret"
  var token = jwt.sign(profile, jwtSecret, { expiresIn: "7d" });
  res.send({
    errorMessage:null,
    errorCode:null,
    success:true,
    data:{
      token: token
    }
  });
});

// const client = new Influx('http://root:root@192.168.1.150:8086,192.168.1.151:8086,192.168.1.152:8086/test');
const client = new Influx('http://dxl:123456@149.129.97.226:8086/telegraf');
client.epoch = 'ms';
client.timeout = 60000;
client.format = 'json';
const table = 'cpu';
client.startHealthCheck();
// 设置socket的session验证
socketIO.of('/cpu').use(socketioJwt.authorize({
  secret: "dingxiaolin_secret",
  handshake: true
}));
//中间件
socketIO.of('/cpu').use(function (socket, next) {
  if (socket.decoded_token.userName) {
        /* 这里需要加个数据库校验用户名是否存在 */  
    next();
  } else {
    return next(new Error('authentication error'));
  }
});
// 建立连接
socketIO.of('/cpu').on('connect', (socket)=>{
  console.info(socket.decoded_token.userName+'用户已连接');
  // if (socketIO.of('/cpu').connected[socket.id]) {
  //   socketIO.of('/cpu').connected[socket.id].emit('message',socket.id);
  //   redisClient.set(socket.id,['socket.id',socket.id]);
  // }
});
//连接中
 socketIO.of('/cpu').on('connection', (socket)=>{
    var startTime = [];
    /* 用户关闭浏览器 */
    socket.on('disconnect', function(){
      console.info(socket.decoded_token.userName+'用户已离开,soketId:'+socket.id);
      clearInterval(timer);
    });
    /* 接收用户操作/首次连接发送数据 */
    socket.on('cpu circletime', function(msg){
      startTime[socket.id]=msg;
      console.log(startTime)
      getCpuInfo(startTime[socket.id],(data)=>{
        socket.emit('cpu message', data);
      })
    });
      /* 循环发送 */
    var timer=setInterval(()=>{
      getCpuInfo(startTime[socket.id],(data)=>{
        socket.emit('cpu message', data);
      })
    },5000)
  if (socketIO.of('/cpu').connected[socket.id]) {
    // socketIO.of('/cpu').to(socket.id).emit('cpu message',socket.id);
    // socketIO.of('/cpu').connected[socket.id].emit('cpu message',socket.id);
  }
  // redisClient.get(socket.id, function(err, reply) {
  //   console.log("reply",reply);  /* 不存在即为null */
  // }); 

 
});

  function getCpuInfo(startTime,cb){
    var reader = client.query(table);
    reader.start = startTime;
    reader.addCalculate('MEAN', 'usage_iowait'); 
    reader.addCalculate('MEAN', 'usage_user');
    reader.addGroup('time(10s)');
    reader.fill = '0';
    reader.then(data => {
        console.log(new Date+"send message success",startTime);
        cb(data);
      }).catch(err => {
        console.error(err);
      });
  }
  server.listen(2019, function(){
    console.log('listening on http://localhost:2019');
  });
