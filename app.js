require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const USERS_FILE = path.join(__dirname, "users.json");

//app.get('/', (req, res)=>{
//	res.render('index');
//});

const readUsers = () =>{
	if (!fs.existsSync(USERS_FILE)) return [];
	const data = fs.readFileSync(USERS_FILE);
	return JSON.parse(data);
};

const writeUsers = (users) => {
	fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

app.post("/register", async (req, res) => {
	try {
		const {username, password} = req.body;
		let users = readUsers();

		if (users.find((user) => user.username === username)) {
			return res.send('Username already exists. <a href="/register">Try again</>');
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		users.push({username, password:hashedPassword});
		writeUsers(users);

		const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn:"1h"});

		res.cookie("token", token, {httpOnly:true});
		res.redirect("/");
	} catch (err){
		res.status(500).send("Error registering user");
	}
});

const authMiddleware = (req, res, next) =>{
	const token = req.cookies.token;

	if (!token) {return res.redirect("/401");}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
		if(err) {
			return res.redirect("/401");
		}
		req.user = decoded;

		next();
	});
};

app.get("/", authMiddleware, (req, res)=>{
	res.render("index", {user: req.user});
});

app.get("/401", (req, res)=>{
	res.status(401).render("401");
});

const checkNotAuthenticated = (req, res, next) =>{
	const token = req.cookies.token;
	if(token) {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
			if (!err) {
				return res.redirect("/");
			}
			next();
		});
	} else{
		next();
	}
};

app.get("/register", checkNotAuthenticated, (req, res) => {
	res.render("register");
});


app.get("/logout", (req, res) =>{
	res.clearCookie("token");
	res.redirect("/login");
});

app.get("/login", checkNotAuthenticated, (req, res)=>{
	res.render("login");
});

app.post("/login", async (req, res) => {
	try {
		const {username, password} = req.body;
		let users = readUsers();
		const user = users.find((u) => u.username === username);

		if (!user) {
			return res.send('Invalid credentials, <a href="/login">Try again</a>');
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch){
			return res.send('Invalid credentials, <a href="/login">Try again</a>');
		}

		const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn:"1h"});

		res.cookie("token", token, {httpOnly:true});
		res.redirect("/");
	}catch{
		res.status(500).send("Error logging in");
	}
});



io.on('connection', (socket) => {
	console.log(`Socket connected: ${socket.id}`);
	// Notification
	socket.on("register-user", ({username}) =>{
		let users = readUsers();
		const user = users.find((u) => u.username === username);

		if (user) {
			socket.username = user.username;
			io.emit('client-message-receive', `New user connected: ${socket.username}`);
		}
		else{
			console.log("whatehell");
		}
	});

	io.emit('client-message-receive', `New User connected: ${socket.username}`)

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
			socket.io(socket.currentRoom).emit('client-message-receive', `User ${socket.username} disconnected`);
			console.log(`Socket ${socket.id} disconnected from room ${socket.currentRoom}`);
		}
		else{
			console.log(`Socket ${socket.id} disconnected`);
		}
	});

});


const PORT = process.env.PORT || 8000
http.listen(PORT, ()=>{
	console.log("Hello world");
});








