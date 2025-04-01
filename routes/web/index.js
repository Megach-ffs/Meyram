const express = require("express");
const router = express.Router();
const { authMiddleware, checkNotAuthenticated } = require('../../middleware/auth');
const userValidator = require('../../validators/user');
const { validationResult } = require('express-validator');
const userController = require('../../controllers/user');

// Register
router.get('/register', checkNotAuthenticated, (req, res) => {
	res.render('register');
});

router.post('/register', userValidator.register, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.render('register', {
			errors: errors.array(),
			old: req.body
		});
	}
	userController.createUser(req, res);
});

// Login
router.get('/login', checkNotAuthenticated, (req, res) => {
	res.render('login');
});

router.post('/login', userValidator.login || [], (req, res) => {
	userController.login(req, res);
});

// Logout
router.get('/logout', (req, res) => {
	res.clearCookie('token');
	res.redirect('/login');
});

// Profile 
router.get('/profile', authMiddleware, userController.getProfile);

router.post('/profile', authMiddleware, userValidator.update, (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const user = require('../../services/user').getById(req.user.id);
		return res.render('user', {
			errors: errors.array(),
			user
		});
	}
	userController.updateProfile(req, res);
});

router.get('/401', (req, res) => {
	res.status(401).render('401');
});

// Chat homepage
router.get('/', authMiddleware, (req, res) => {
	const user = require('../../services/user').getById(req.user.id);
	res.render('index', { user });
});

module.exports = router;

