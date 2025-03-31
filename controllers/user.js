const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userService = require('../services/user');



const userController = {
	createUser: async (req, res) => {
	try {
		const {username, password} = req.body;
		let users = userService.readUsers();

		if (users.find((user) => user.username === username)) {
			return res.send('Username already exists. <a href="/register">Try again</>');
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		users.push({username, password:hashedPassword});
		userService.writeUsers(users);

		const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn:"1h"});

		res.cookie("token", token, {httpOnly:true});
		res.redirect("/");
	} catch (err){
		res.status(500).send("Error registering user");
	}
},

login:async (req, res) => {
	try {
		const {username, password} = req.body;
		let users = userService.readUsers();
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
}
};


module.exports = userController;


