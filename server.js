
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4} = require('uuid')
const users = {}

app.set('view engine', 'ejs')
app.use(express.static('public'))

// redirect to the user to the room dyanamically
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

// Let's add the user to a new room for the web call
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

// handle the connection of the software with the socket.io package
// listen to events under the following conditions: once a chap connects
io.on('connection', socket => {
  socket.on('join-room', (roomId, name) => {
    socket.join(roomId)
    users[socket.id] = `${name}`
    socket.to(roomId).broadcast.emit('user-connected', users[socket.id])
  })

  // run the user-connected function if socket detects new connection
  //socket.on('new-user', name => {
    
  //})   
  //socket.broadcast.emit('user-connected', users[socket.id])

  socket.on('send-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })

  // run disconnect function if user leaves room
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    //socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})
server.listen(3000)
