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