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
var start=""
client.startHealthCheck();

 io.of('/cpu').on('connection', (socket)=>{
    socket.on('cpu start', (msg)=>{
      console.log("msgTime",msg);
      start=msg;
      });
   /* 首次连接发送数据 */
   setInterval(()=>{
    var reader = client.query(table);
    reader.start = "-30m";
    reader.addCalculate('MEAN', 'usage_iowait'); 
    reader.addCalculate('MEAN', 'usage_user');
    reader.addGroup('time(10s)');
    reader.fill = '0';
    reader.then(data => {
        console.log("send message success");
        socket.emit('cpu message', data);
      }).catch(err => {
        console.error(err);
      });
  },5000)
   
});
 

  function getCpuInfo(){
    var reader = client.query(table);
    reader.start = start;
    reader.addCalculate('MEAN', 'usage_iowait'); 
    reader.addCalculate('MEAN', 'usage_user');
    reader.addGroup('time(10s)');
    reader.fill = '0';
    reader.then(data => {
        console.log("send message success");
        socket.emit('cpu message', data);
      }).catch(err => {
        console.error(err);
      });
  }
//  var server = app.listen(2019,()=>{
//     var host = server.address().address;
//      var port = server.address().port;
//         console.log('demo listening at http://%s:%s', host, port);
// })
server.listen(2019, function(){
  console.log('socket listening on *:2019');
});