const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res)=>{
	res.render('index');
});


http.listen(3000, ()=>{
	console.log("Hello world");
});
