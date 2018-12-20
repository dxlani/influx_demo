const _ = require('lodash');
const Influx = require('influxdb-nodejs');
const QL = require('influx-ql');
//const client = new Influx('http://root:root@192.168.1.150:8086,192.168.1.151:8086,192.168.1.152:8086/test');
 const client = new Influx('http://dxl:123456@149.129.97.226:8086/test');
client.epoch = 'ms';
client.timeout = 2000;
client.format = 'json';
console.info(client.epoch, client.format, client.timeout);
const table = 'table';
// client.dropDatabase()
//  .then(() => console.info('drop database success'))
//  .catch(err => console.error(`drop database fail, ${err.message}`));

client.showDatabases()
    .then(data => {
        console.info('showDatabases:', data.results[0].series[0].values);
    })
    .catch(err => {
        console.error('showDatabases:', err);
    });
client.showMeasurements()
    .then(data => {
        console.info('showMeasurements:', data.results[0].series[0].values);
    })
    .catch(err => {
        console.error('showMeasurements:', err);
    });
client.showRetentionPolicies()
    .then(data => {
        console.info('showRetentionPolicies:', data.results[0].series[0].values);
    })
    .catch(err => {
        console.error('showRetentionPolicies:', err);
    });
client.showTagKeys(table)
    .then(data => {
        console.info('showTagKeys:', data.results[0].series[0].values);
    }).catch(err => {
        console.error('showTagKeys:', err);
    });
client.showFieldKeys(table)
    .then(data => {
        console.info('showFieldKeys:', data.results[0].series[0].values);
    }).catch(err => {
        console.error('showFieldKeys:', err);
    });
client.showSeries(table)
    .then(data => {
        console.info('showSeries:', data.results[0].series[0].values);
    }).catch('showSeries', err => {
        console.error('showSeries:', err);
    });

/* 写数据 */
client.createDatabaseNotExists().then(data => {
    client.writePoint(table, {
        use: _.random(100, 600),
        code: 200,
      }, {
        spdy: _.sample(['0', '1', '2']),
        type: _.sample(['1', '2', '3', '4', '5']),
      }).then(() => console.info('write point success'))
      .catch(err => console.error(`write point fail,${err.message}`));
});

// client.write('https')
// .tag({
//   status: '40x',
//   size: '2K'
// })
// .field({
//   code: 400,
//   value: 1
// })
// .queue()
// .then(() => {
// console.info('write point success');
// }).catch(err => {
// console.error(err);
// });

/* 读数据 */
const reader = client.query(table);
// reader.tag('spdy', "2");
// reader.tag('type', "3");
reader.addCondition('use > 200');
reader.addCondition('use < 500');
// reader.addGroup('time(5m)');
reader.add
reader.slimit = 5;
reader.limit = 50;
reader.start = '2018-12-19';
reader.end = '-3h';
reader.then(data => {
    console.info("list",data.results[0].series[0].values);
  }).catch(err => {
    console.error(err);
  });

// const ql = new QL('test');
// ql.measurement = 'table';
// ql.where('type', "2");
// // ql.clean();
// console.log('ql',ql.toSelect())
client.startHealthCheck();
// custom ping function
client.startHealthCheck((backend, cb) => {
  // the backend fail if callback with error
  setTimeout(cb, 10); 
});

