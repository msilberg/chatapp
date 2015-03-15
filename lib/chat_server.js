/**
 * Created by mike on 3/15/15.
 */

var socketIO = require('socket.io'),
    io,
    guestNumber = 1,
    nickNames = {},
    namesUsed = [],
    currentRoom = {};

exports.listen = function(server) {
    io = socketIO.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function(socket) {
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        joinRoom(socket, 'Lobby');
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);
        socket.on('rooms', function(){
            socket.emit('rooms', io.sockets.manager.rooms);
        });
        handClientDisconnection(socket, nickNames, namesUsed);
    });
};