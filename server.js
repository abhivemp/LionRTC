const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4} = require('uuid')
const users = {}

app.set('view engine', 'ejs')
app.use(express.static('public'))

// Redirect the user to the room dynamically
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

// Let's add the user to a new room for the web call
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

// Handle the connection of the software with the socket.io package
// Listen to events under the following conditions: once a chap connects
io.on('connection', socket => {
  socket.on('join-room', (roomId, name) => {
    socket.join(roomId)
    users[socket.id] = `${name}`
    socket.to(roomId).broadcast.emit('user-connected', users[socket.id])

    // Run disconnect function if user leaves room
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id])
      delete users[socket.id]
    })

    socket.on('send-message', message => {
      socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
  })
})

server.listen(3000)
