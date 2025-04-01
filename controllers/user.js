
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('../services/user');

const userController = {
	createUser: async (req, res) => {
		try {
			const { username, password, email, name, surname, description } = req.body;

			const users = userService.getAll();

			const userExists = users.find(u => u.user.username === username);
			if (userExists) {
				return res.status(400).render('register', {
					errors: [{ msg: "Username already exists" }],
					old: req.body
				});
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = userService.createUser({
				username,
				email,
				name,
				surname,
				description,
				password: hashedPassword
			});

			const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
				expiresIn: '1h'
			});

			res.cookie('token', token, { httpOnly: true });
			res.redirect('/');
		} catch (err) {
			console.error(err);
			res.status(500).send("Error registering user");
		}
	},

	login: async (req, res) => {
		try {
			const { username, password } = req.body;
			const users = userService.getAll();

			const userObj = users.find(u => u.user.username === username);
			if (!userObj) {
				return res.send('Invalid credentials, <a href="/login">Try again</a>');
			}

			const isMatch = await bcrypt.compare(password, userObj.user.password);
			if (!isMatch) {
				return res.send('Invalid credentials, <a href="/login">Try again</a>');
			}

			const token = jwt.sign({ id: userObj.id }, process.env.JWT_SECRET, {
				expiresIn: '1h'
			});

			res.cookie('token', token, { httpOnly: true });
			res.redirect('/');
		} catch (err) {
			console.error(err);
			res.status(500).send("Error logging in");
		}
	},

	getProfile: (req, res) => {
		const user = userService.getById(req.user.id);
		if (!user) return res.redirect('/login');
		res.render('user', { user, errors: [] });
	},

	updateProfile: async (req, res) => {
		const { name, surname, email, description, password } = req.body;

		const updateData = {
			name,
			surname,
			email,
			desc: description
		};

		if (password && password.trim() !== '') {
			updateData.password = await bcrypt.hash(password, 10);
		}

		const updated = userService.updateUser(req.user.id, updateData);

		if (!updated) return res.status(404).send("User not found");

		res.redirect('/profile');
	}
};

module.exports = userController;

