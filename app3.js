const express = require('express');
const app = express();
const server=require('http').createServer(app);
const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.text());
//设置静态资源
app.use(express.static("./public"))

const Influx = require('influxdb-nodejs');
// const redis = require("redis"),
// redisClient = redis.createClient();
// redisClient.on("error", function (err) {
//   console.log("redisError " + err);
// });

const io=require('socket.io')(server,{
  path: '/',
  origins:'*:*',
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: true
});

app.use('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Authorization,Accept,X-Requested-With,X-Request-Id");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
})

app.post('/wslogin', function (req, res) {
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
var startTime="-30m";
client.startHealthCheck();
// 设置socket的session验证
io.of('/cpu').use(socketioJwt.authorize({
  secret: "dingxiaolin_secret",
  handshake: true
}));
//中间件
io.of('/cpu').use(function (socket, next) {
  /* 这里需要加个数据库校验用户名是否存在 */
  if (socket.decoded_token.userName) {
    console.info(socket.decoded_token.userName+'用户已连接');
    next();
  } else {
    return next(new Error('Missing user'));
  }
});
// 建立连接
 io.of('/cpu').on('connection', (socket)=>{
    /* 用户关闭浏览器 */
    socket.on('disconnect', function(){
      startTime="-30m";
      console.info(socket.decoded_token.userName+'用户已离开');
      clearInterval(timer);
    });
    /* 接收用户操作 */
    socket.on('cpu circletime', function(msg){
      console.log("msg",msg)
      startTime=msg;
      getCpuInfo(startTime,(data)=>{
        socket.emit('cpu message', data);
      })
    });
   /* 首次连接发送数据 */
    getCpuInfo(startTime,(data)=>{
      startTime="-30m";
      socket.emit('cpu message', data);
    })
   /* 循环发送 */
   var timer=setInterval(()=>{
    getCpuInfo(startTime,(data)=>{
      socket.emit('cpu message', data);
    })
  },5000)
  // console.log(socket.id)
  // if (io.of('/cpu').connected[socket.id]) {
  //   io.of('/cpu').connected[socket.id].emit('message',socket.id);
  //   redisClient.set(socket.id,['socket.id',socket.id]);
  // }
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
        console.log(new Date+"send message success");
        cb(data);
      }).catch(err => {
        console.error(err);
      });
  }
  app.listen(2018, function(){
   console.log('listening on http://localhost:2018');
  /* 是否能监听同一个端口呢？ */
  });
  server.listen(2019, function(){
  //console.log('listening on http://localhost:2019');
  });
