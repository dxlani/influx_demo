var influx = require('influx')
const _ = require('lodash');
var database = 'test'
var tableName = "test"
var host = "coinpot.cn"
var client = influx({
  //cluster configuration
  hosts: [
    {
      host: '192.168.1.151',
    },
    {
      host: '192.168.1.152',
    },
    {
      host: '192.168.1.153',
    },
  ],
  // or single-host configuration
  // host: host,
  // port: 8086, 
  protocol: 'http',
  username: 'root',
  password: '',
  database: database
})

// client.setRequestTimeout( null )
// client.setFailoverTimeout( 60000 )


/* 删除库 */
// client.dropDatabase( database, function(err,response) { 
//   if (err) throw err
//   console.log("dropDatabase:",response)
// })
/* 创建库 */
// client.createDatabase( database, function(err,response) { 
//    if (err) return console.error(err);
//   console.log("createDatabase:",response)
// })

/* 获取所有数据库名称 */
// client.getDatabaseNames(function(err,response){ 
//    if (err) throw err
//    console.log("getDatabaseNames:",response)
// }) 

/* 获取表名 */
// client.getMeasurements(function(err,response){ 
//    if (err) throw err
//    console.log("getMeasurements :",response[0].series[0].values)
// }) 
/* 删除表 */
// client.dropSeries(measurementName,function(err,response){ 
//    if (err) throw err
//    console.log("getMeasurements :",response[0].series[0].values)
// }) 
/* 获取tag分类组合 */
client.getSeries('test', function (err, response) {
  if (err) throw err
  console.log("getSeries :", response[0].values)
})
/* 获取tag分类 */ /* 无用 */
// client.getSeriesNames('test',function(err,response){
//    if (err) throw err
//    console.log("getSeriesNames :",response)
// })
// client.dropSeries ( 'test', function(err,response) { })

/* 写入多表、多条数据 */
var points = [
  [_.random(100, 600), { foobar: 'CBA' }],
  [{ value: _.random(100, 600), time: new Date() }, { foobar: 'NBA' }]
]
var points2 = [
  [{ value: _.sample(['0', '1', '2']) }, { tag: 'points2foobar' }],
  [{ value: _.sample(['0', '1', '2']) }, { someothertag: 'points2baz' }],
]
var series = {
  series_name_one: points,
  series_name_two: points2
};
// client.writeSeries(series, ['ms'], function (err, response) {
//   if (err) throw err
//   console.log("writeSeries:", response)
// })
/* 写入单表、多条数据 */
// client.writePoints(tableName, points, function (err, result) {
// if (err) throw err
//   console.log("writePoints", result)
// })
/* 写入单表、单条数据 */
client.writePoint(tableName, { value: 232, value2: 123 }, { foo: 'bar', foobar: 'baz' }, function (err, result) {
  if (err) throw err
  console.log("writePoint", result)
})
// client.writePoint(tableName, 1, { foo: 'bar', foobar: 'baz' }, function (err, result) {
//   if (err) throw err
//   console.log("writePoint", result)
// })
/* 查询 */
client.query('select TOP(value,3) from test', function (err, response) {
  if (err) throw err
  console.log("query:", response)
})
client.gr
