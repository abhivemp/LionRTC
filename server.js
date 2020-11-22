
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4} = require('uuid')

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
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    // run the user-connected function if socket detects new connection
    socket.to(roomId).broadcast.emit('user-connected', userId)

    // run disconnect function if user leaves room
    socket.on('disconnect', () => {
     socket.to(roomId).broadcast.emit('user-disconnected', userId)
   })
  })
})
server.listen(3000)
