const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http=require('http').Server(app);
const io=require('socket.io')(http);
app.use(bodyParser.json());
app.use(bodyParser.text());
const _ = require('lodash');
const Influx = require('influxdb-nodejs');
const cors=require ('./cors')
cors();
// const QL = require('influx-ql');
// const client = new Influx('http://root:root@192.168.1.150:8086,192.168.1.151:8086,192.168.1.152:8086/test');
const client = new Influx('http://dxl:123456@149.129.97.226:8086/telegraf');
client.epoch = 'ms';
client.timeout = 5000;
client.format = 'json';
console.info(client.epoch, client.format, client.timeout);
const table = 'cpu';

client.startHealthCheck();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})
app.get('/', function (req, res) {
    var reader = client.query(table);
    reader.start = '-5m';
    reader.addCalculate('MEAN', 'usage_iowait'); /* 值的平均值 */
    reader.addGroup('time(10s)');
    reader.fill = '0';
    reader.then(data => {
        console.log("send success");
        res.send(data);
      }).catch(err => {
        console.error(err);
      });
 })

//  io.on('connection', function(socket){
//   socket.on('cpu message', function(msg){
//     // io.emit('cpu message', msg);
//     io.send('');
//   });
// });
 
 var server = app.listen(2019,()=>{
    var host = server.address().address;
     var port = server.address().port;
        console.log('demo listening at http://%s:%s', host, port);
})
