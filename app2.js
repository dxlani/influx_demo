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


/* 写数据 */
// client.createDatabaseNotExists().then(data => {
//     client.writePoint(table, {
//         use: _.random(100, 600),
//         code: 200,
//       }, {
//         spdy: _.sample(['0', '1', '2']),
//         type: _.sample(['1', '2', '3', '4', '5']),
//       }).then(() => console.info('write point success'))
//       .catch(err => console.error(`write point fail,${err.message}`));
// });


/* 读数据 */
// const reader = client.query(table);
// reader.addField('use','code');
// reader.addCondition('use > 200');
// reader.addCondition('use < 500');
// reader.condition('use',397);   
// reader.addGroup('spdy','type');
//  reader.addGroup('time(10m)');
// reader.tag('spdy', "2");
// reader.tag('type', "3");
// reader.slimit = 5;
// reader.limit = 10;
//  reader.start = '-1m';
// reader.start = '2018-12-19 13:00:00';
//  reader.end = '-1h';
// reader.addCalculate('count', 'use'); /* 值数量 */
// reader.addCalculate('DISTINCT', 'use'); /* 值集合 */
// reader.addCalculate('MEAN', 'use'); /* 值的平均值 */
// reader.addCalculate('SUM', 'use'); /* 值的总和 */
// reader.addCalculate('SPREAD', 'use'); /* 差值 */
//  reader.addCalculate('BOTTOM','use,3'); 
// reader.fill = 0;

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
    reader.limit = 10;
    reader.start = '-1m';
    // reader.addCalculate('MEAN', 'usage_idle'); /* 值的平均值 */
    //  reader.addGroup('time(10s)');
    reader.then(data => {
        console.log("list",JSON.stringify(data));
        res.send(data);
      }).catch(err => {
        console.error(err);
      });
 })


 
 var server = app.listen(2019,()=>{
    var host = server.address().address;
     var port = server.address().port;
        console.log('demo listening at http://%s:%s', host, port);
})
