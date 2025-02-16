const io = require('@pm2/io')

function pm2metrics ( x , y ){
  const container = io.metric({
    name: x,
  })

  container.set( y );
}

module.exports = pm2metrics;