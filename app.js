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
const chatio = require('./sockets/chat');

app.set('view engine', 'ejs');
app.set('views', './views');

//const apiRoutes = require('./routes/api');
const webRoutes = require('./routes/web');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
//app.use('/api', apiRoutes);
app.use('/', webRoutes);

const USERS_FILE = path.join(__dirname, "users.json");
chatio(io);


const PORT = process.env.PORT || 8000
http.listen(PORT, ()=>{
	console.log("Hello world");
});








