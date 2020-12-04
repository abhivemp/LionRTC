//import {msg} from 'room.ejs'

// this socket connects to root path
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const msgContainer = document.getElementById('message-container')
const msgForm = document.getElementById('send-container')
const msgInput = document.getElementById('message-input')

const name = prompt('What is your name?')
appendMessage('You joined')
//socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', userId => {
  appendMessage(`${name} connected`)
  connectToNewUser(userId, stream)
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
  appendMessage(`${name} disconnected`)
})

msgForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = msgInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-message', message)
  msgInput.value = ''
})

// Basic Peer configurations for dyanamic id generation with the uuid package
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
// user's personal video element. We mute them because we don't want to them to see themselves
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    console.log('Anotha one!!')
  })

  /*socket.on('user-connected', userId => {
    appendMessage(`${name} connected`)
  })*/
})

/*
socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})*/



myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  msgContainer.append(messageElement)
}
