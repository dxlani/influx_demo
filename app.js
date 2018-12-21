var influx = require('influx')
const _ = require('lodash');
var database = 'test'
var tableName = "test"
var host = "coinpot.cn"
var client = influx({
  //cluster configuration
  // hosts: [
  //   {
  //     host: '192.168.1.151',
  //   },
  //   {
  //     host: '192.168.1.152',
  //   },
  //   {
  //     host: '192.168.1.153',
  //   },
  // ],
  // or single-host configuration
  host: host,
  // port: 8086, 
  protocol: 'http',
  username: 'dxl',
  password: '123456',
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
// client.getSeries('test', function (err, response) {
//   if (err) throw err
//   console.log("getSeries :", response[0].values)
// })
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
// client.writePoint(tableName, { value: 232, value2: 123 }, { foo: 'bar', foobar: 'baz' }, function (err, result) {
//   if (err) throw err
//   console.log("writePoint", result)
// })
/* 写入单表、单条、单值数据 */ //{ value : 1 }
// client.writePoint(tableName, 1, { foo: 'bar', foobar: 'baz' }, function (err, result) {
//   if (err) throw err
//   console.log("writePoint", result)
// })
/* 写入单表、单条、带时间数据 */ //{ value : 1 }
// client.writePoint(tableName, {time: new Date(), value: 232, value2: 123}, null, function (err, result) {
//   if (err) throw err
//   console.log("writePoint", result)
// })
/* 查询 */
client.query('select * from test', function (err, response) {
  if (err) throw err
  console.log("query:", response)
})


//  client.createRetentionPolicy('test', 'test', '1h', 1, true, function (err,resonse) {})
// client.alterRetentionPolicy('test', 'test', '1h', 1, true, function(err,response) {} )
// client.getRetentionPolicies(database,function(err,response) {
//   if (err) throw err
//   console.log("getRetentionPolicies:",JSON.stringify(response))
// } )

/* 组合查询用query */
// client.query('SELECT * FROM myseries; SELECT MEAN(VALUE) as avgvalue from myseries', function (err, results) {});
/* 单条查询用queryRaw */
// client.queryRaw([database,] 'SELECT MEDIAN(column) FROM myseries WHERE time > now() - 24h', function(err, results) { })

/* 以下函数均不计算空和0 */
//COUNT(value) value不为空且不为0的总数
//DISTINCT(value) value值的不为空且不为0种类
//MEAN(value) value值的不为空且不为0的平均值
//MEDIAN(value) value值的不为空且不为0的中位数
//SPREAD(value) value的最大值和最小值的差值
//SUM(value) value的值总和
//BOTTOM(value,N) value最小的N个值
//FIRST(value) value字段最老的取值
//LAST(value) value字段最新的取值
//MAX(value) value字段最大的取值
//PERCENTILE(value,N) value字段值介于N%，N[0,100]
//DERIVATIVE(value,T) value字段值连续的时间值之间的差异
