const http = require('http')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.static('public'))
app.set('port', PORT)

const server = http.createServer(app)
server.on('listening', () => {
    console.log(`Listening on port ${PORT}`)
})

// Web socket
const io = require('socket.io')(server)

io.sockets.on('connection', (socket) => {
	console.log('Client connected: ' + socket.id)
	socket.on('mouse', (data) => socket.broadcast.emit('mouse', data))
	socket.on('disconnect', () => console.log('Client has disconnected'))
})

server.listen(PORT)
