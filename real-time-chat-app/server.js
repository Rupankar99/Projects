/*const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const users = {};

//Create a server
const app = express();
const server = http.createServer(app)
const io = socketio(server);

PORT = process.env.PORT || 5000;
//Get the static folder
app.use(express.static(path.join(__dirname,'public')));

//Set up socket.io
io.on('connection',socket=>{
    socket.on('new-user-joined',name=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message: message, name: users[socket.id]})
    });
    socket.on('disconnect',message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

server.listen(PORT,()=>{
    console.log('Server running');
})*/

///New code 

const { Socket } = require('dgram');
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const users = {};
const typers = {} //For storing people who are typing.

//Create a server
const app = express();
const server = http.createServer(app)
const io = socketio(server);

const PORT = process.env.PORT || 5000;
//Get the static folder
app.use(express.static(path.join(__dirname,'public')));

//Setting up socket.io connection
io.on('connection',socket=>{
    //console.log('User Connected');
    socket.on('user-connected',data=>{
        users[socket.id] = {
            id:socket.id,
            name: data.name
        };
        socket.broadcast.emit('user-connected',users[socket.id]);  
    });
    socket.on('typing',data=>{
        typers[socket.id] = 1;

        socket.broadcast.emit('typing',{
            user: users[socket.id].name,
            typers: Object.keys(typers).length
        });
    });
    socket.on('stopped-typing',()=>{
        delete typers[socket.id];
        socket.broadcast.emit('stopped-typing',Object.keys(typers).length);
    });
    socket.on('send-message',payload=>{
        delete typers[socket.id];
        socket.broadcast.emit('send-message',{
            user: payload.user,
            msg: payload.msg,
            typers: Object.keys(typers).length
        });
    });
    socket.on('disconnect',()=>{
        socket.broadcast.emit('user-left',users[socket.id]);
        console.log(users[socket.id]);
        delete users[socket.id];
    });
});

//listen to the server
server.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
});