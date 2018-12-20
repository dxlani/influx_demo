var influx = require('influx')

var host = 'coinpot.cn'
var username = 'dxl'
var password = '123456'
var database = 'test'

var client = influx({
    //cluster configuration
    hosts : [
      {
        host : '149.129.97.226',
        port : 8086, //optional. default 8086
        protocol : 'http' //optional. default 'http'
      }
    ],
    // or single-host configuration
    host : host,
    port : 8086, // optional, default 8086
    protocol : 'http', // optional, default 'http'
    username : username,
    password : password,
    database : database
  })



// client.query('insert test,captain_id=23,host=serverB,region=us_west value=22',function(err,response) { 
//   if (err) throw err
//   console.log(response)
// })

var points = [
  //first value with tag
  [{value: 232}, { tag: 'foobar'}],
  //second value with different tag
  [{value: 212}, { someothertag: 'baz'}],
  //third value, passed as integer. Different tag
  [123, { foobar: 'baz'}],
  //value providing timestamp, without tags
  [{value: 122, time : new Date()}]
]

var points2 = [
  //first value with tag
  [{value: 1232}, { tag: 'foobar'}],
  //second value with different tag
  [{value: 223212}, { someothertag: 'baz'}],
  //third value, passed as integer. Different tag
  [12345, { foobar: 'baz'}],
  //value providing timestamp, without tags
  [{value: 23122, time : new Date()}]
]
var series = {
    series_name_one : points,
    series_name_two : points2
};

// client.writeSeries(series,['ms'],function(err,response) {
//       if (err) throw err
//       console.log("writeSeries:",response)
//  })

var tableName="test"
 client.writePoints(tableName, points, function(err, result){
  console.log("writePoint", result)
} )

 client.query('select * from test',function(err,response) { 
  if (err) throw err
  console.log("query:",response)
})
  // var point = { attr : value, time : new Date()};
  // client.writePoint(seriesName, values, tags, [options,], function(err, response) {
  //   if (err) throw err
  //     console.log(response)
  // })

