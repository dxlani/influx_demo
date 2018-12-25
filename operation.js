// client.dropDatabase()
//  .then(() => console.info('drop database success'))
//  .catch(err => console.error(`drop database fail, ${err.message}`));

// client.showDatabases()
//     .then(data => {
//         console.info('showDatabases:', data.results[0].series[0].values);
//     })
//     .catch(err => {
//         console.error('showDatabases:', err);
//     });
// client.showMeasurements()
//     .then(data => {
//         console.info('showMeasurements:', data.results[0].series[0].values);
//     })
//     .catch(err => {
//         console.error('showMeasurements:', err);
//     });
// client.showRetentionPolicies()
//     .then(data => {
//         console.info('showRetentionPolicies:', data.results[0].series[0].values);
//     })
//     .catch(err => {
//         console.error('showRetentionPolicies:', err);
//     });
// client.showTagKeys(table)
//     .then(data => {
//         console.info('showTagKeys:', data.results[0].series[0].values);
//     }).catch(err => {
//         console.error('showTagKeys:', err);
//     });
// client.showFieldKeys(table)
//     .then(data => {
//         console.info('showFieldKeys:', data.results[0].series[0].values);
//     }).catch(err => {
//         console.error('showFieldKeys:', err);
//     });
// client.showSeries(table)
//     .then(data => {
//         console.info('showSeries:', data.results[0].series[0].values);
//     }).catch('showSeries', err => {
//         console.error('showSeries:', err);
//     });


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
// reader.addGroup('time(10m)');
// reader.tag('spdy', "2");
// reader.tag('type', "3");
// reader.slimit = 5;
// reader.limit = 10;
// reader.start = '-1m';
// reader.start = '2018-12-19 13:00:00';
// reader.end = '-1h';
// reader.addCalculate('count', 'use'); /* 值数量 */
// reader.addCalculate('DISTINCT', 'use'); /* 值集合 */
// reader.addCalculate('MEAN', 'use'); /* 值的平均值 */
// reader.addCalculate('SUM', 'use'); /* 值的总和 */
// reader.addCalculate('SPREAD', 'use'); /* 差值 */
// reader.addCalculate('BOTTOM','use,3'); 
// reader.fill = 0;