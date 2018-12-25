const app = require('express')();
const server=require('http').createServer(app);
const io=require('socket.io')(server);
const Influx = require('influxdb-nodejs');
var async = require("async")
// const client = new Influx('http://root:root@192.168.1.150:8086,192.168.1.151:8086,192.168.1.152:8086/test');
  const client = new Influx('http://dxl:123456@149.129.97.226:8086/telegraf');
client.epoch = 'ms';
client.timeout = 5000;
client.format = 'json';
console.info(client.epoch, client.format, client.timeout);
const table = 'cpu';
var startTime="-10m"
var start=""
client.startHealthCheck();

 io.of('/cpu').on('connection', (socket)=>{
   /* 时间段事件 */
    socket.on('cpu start', (msg)=>{
      console.log("msgTime",msg);
      start=msg;
      });
   /* 首次连接发送数据 */
    getCpuInfo(startTime,(data)=>{
      socket.emit('cpu message', data);
    })
   /* 循环发送 */
   setInterval(()=>{
    getCpuInfo(startTime,(data)=>{
      socket.emit('cpu message', data);
    })
  },5000)
    
  console.log('socket.id',socket.id)
  if (io.of('/cpu').connected[socket.id]) {
    io.of('/cpu').connected[socket.id].emit('message',socket.id);
}
});
io.of('/cpu').on('disconnect',function(){
  console.log('用户已离开')
  startTime="-10m"
  start=""
})
  function getCpuInfo(startTime,cb){
    var reader = client.query(table);
    if (startTime!=start && start!=""){
      startTime=start;
    }
    reader.start = startTime;
    reader.addCalculate('MEAN', 'usage_iowait'); 
    reader.addCalculate('MEAN', 'usage_user');
    reader.addGroup('time(10s)');
    reader.fill = '0';
    reader.then(data => {
        // console.log("send message success");
        cb(data);
      }).catch(err => {
        console.error(err);
      });
  }
server.listen(2019, function(){
  console.log('socket listening on *:2019');
});