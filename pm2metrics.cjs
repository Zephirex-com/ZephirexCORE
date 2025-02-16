const io = require('@pm2/io')

const pm2metrics = io.metric({
  name: 'USDpl',
})

pm2metrics.set(19);

module.exports = pm2metrics;