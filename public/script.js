// This socket connects to root path
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const msgContainer = document.getElementById('message-container')
const msgForm = document.getElementById('send-container')
const msgInput = document.getElementById('message-input')

appendMessage('You joined')

msgForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = msgInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-message', message)
  msgInput.value = ''
})

// Basic Peer configurations for dynamic id generation with the uuid package
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

// User's personal video element. We mute them because we don't want to them to hear themselves
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
// Connect user to room and append saying they have been connected
  socket.on('user-connected', name => {
    appendMessage(`${name} connected`)
    connectToNewUser(name, stream)
  })
})
// Append the message to the page if the chat-function action triggered
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
  if (peers[name]) peers[name].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})
// Add the user to the existing stream
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
