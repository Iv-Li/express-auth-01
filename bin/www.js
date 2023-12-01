const http = require('http')
const app = require('../app')
const debug = require('debug')

/*
getting port from environment and store it in Express
*/
const port = normalizePort(process.env.PORT || 3000)
app.set('port', port)

/*
create HTTP server
*/
const server = http.createServer(app)

/*
listen on provided port, on all network interfaces
*/
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)


/*
normalize a port into a number, string or false
*/
function normalizePort(value) {
  const port = parseInt(value, 10)

  if(isNaN(port)) return value

  if(port >= 1) return port

  return false
}

/*
error event
*/
function onError(err) {
  if(err.syscall !== 'listen') {
    throw err
  }

  const bind = typeof port === 'string'
    ? 'Pipe' + port
    : 'Port' + port

  switch (err.code) {
    case 'EACCES':
      console.error(bind + ' required elevated privilege')
      process.exit(1)
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break;
    default:
      throw err
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof port === 'string'
    ? 'Pipe' + addr
    : 'Port' + addr
  debug('Listening on ' + bind)

}

