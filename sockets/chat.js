const userService = require('../services/user');


function chatIO(io) {
io.on('connection', (socket) => {
	console.log(`Socket connected: ${socket.id}`);
	// Notification
	socket.on("register-user", ({username}) =>{
		let users = userService.readUsers();
		const user = users.find((u) => u.username === username);

		if (user) {
			socket.username = user.username;
			io.emit('client-message-receive', `New user connected: ${socket.username}`);
		}
		else{
			console.log("whatehell");
		}
	});

	//io.emit('client-message-receive', `New User connected: ${socket.username}`)

	socket.on('join-room', (newRoom) => {
		const previousRoom = socket.currentRoom;

		if (previousRoom){
			socket.leave(previousRoom);
			
			//Notification of quit
			
			socket.to(previousRoom).emit('client-message-receive', `User ${socket.username} left the chat`);
			console.log(`Socket ${socket.id} left room ${previousRoom}`);
		}
		socket.join(newRoom);
		socket.currentRoom = newRoom;

		socket.to(newRoom).emit('client-message-receive', `User ${socket.username} joined the chat`);
		console.log(`Socket ${socket.id} joined room ${newRoom}`);

		socket.emit('room-changed', newRoom);
	});

	socket.on('client-message-send', ({msg,room}) => {
		console.log(`Message from ${socket.id} in ${room}: \n${msg}`);
		io.to(room).emit('client-message-receive', `${socket.username} : ${msg}`);
	});

	socket.on('disconnect', () => {
		io.emit('client-message-receive', `User disconnected: ${socket.username}`);

		if (socket.currentRoom) {
			io.to(socket.currentRoom).emit('client-message-receive', `User ${socket.username} disconnected`);
			console.log(`Socket ${socket.id} disconnected from room ${socket.currentRoom}`);
		}
		else{
			console.log(`Socket ${socket.id} disconnected`);
		}
	});

});
};

module.exports = chatIO;

