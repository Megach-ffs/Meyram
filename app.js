const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res)=>{
	res.render('index');
});

io.on('connection', (socket) => {
	console.log(`Socket connected: ${socket.id}`);
	// Notification
	io.emit('client-message-receive', `New User connected: ${socket.id}`)

	socket.on('join-room', (newRoom) => {
		const previousRoom = socket.currentRoom;

		if (previousRoom){
			socket.leave(previousRoom);
			//Notification of quit
			
			socket.to(previousRoom).emit('client-message-receive', `User ${socket.id} left the chat`);
			console.log(`Socket ${socket.id} left room ${previousRoom}`);
		}
		socket.join(newRoom);
		socket.currentRoom = newRoom;

		socket.to(newRoom).emit('client-message-receive', `User ${socket.id} joined the chat`);
		console.log(`Socket ${socket.id} joined room ${newRoom}`);

		socket.emit('room-changed', newRoom);
	});

	socket.on('client-message-send', ({msg,room}) => {
		console.log(`Message from ${socket.id} in ${room}: \n${msg}`);
		io.to(room).emit('client-message-receive', `${socket.id} : ${msg}`);
	});

	socket.on('disconnect', () => {
		io.emit('client-message-receive', `User disconnected: ${socket.id}`);

		if (socket.currentRoom) {
			socket.io(socket.currentRoom).emit('client-message-receive', `User ${socket.id} disconnected`);
			console.log(`Socket ${socket.id} disconnected from room ${socket.currentRoom}`);
		}
		else{
			console.log(`Socket ${socket.id} disconnected`);
		}
	});

});



http.listen(8000, ()=>{
	console.log("Hello world");
});








