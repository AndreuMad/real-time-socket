const express = require('express');
const app = express();
const server = require('http').Server(app);
const router = express.Router();
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(router);

router.route('/')
  .get((req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

router.route('/javascript')
  .get((req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
  });

router.route('/swift')
  .get((req, res) => {
    res.sendFile(__dirname + '/public/swift.html');
  });

router.route('/css')
  .get((req, res) => {
    res.sendFile(__dirname + '/public/css.html');
  });

const tech = io.of('/tech');

tech.on('connection', (socket) => {
  socket.on('join', ({ room }) => {
    socket.join(room);
    tech.in(room).emit('message', `New user joined ${room} room`);
  });

  socket.on('message', ({ room, message }) => {
    console.log(`message: ${message}`);
    tech.in(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    tech.emit('message', 'user disconnected');
  });
});
