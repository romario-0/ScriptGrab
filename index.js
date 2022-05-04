const http = require('http');
const path = require('path');
const express = require('express');
const cors = require("cors");
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);

var corsOptions = {
  //origin: "http://localhost:8000"
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const io = socketio(server);

app.post("/ansible",async function(req, res) {
  const { exec } = require('child_process');
  var yourscript = await exec('sh test.sh',
          (error, stdout, stderr) => {
              console.log(stdout);
              res.send({message : stdout});
              if (error !== null) {
                  console.log(`exec error: ${error}`);
                  res.send({error : error});
              }
  });
});

io.on('connection', socket => {
    socket.emit('message', 'Connected to server');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;