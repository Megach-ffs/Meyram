const express = require("express");
const router = express.Router();

const authChecker = require('../../middleware/auth');
const userController = require('../../controllers/user');

router.get('/register', authChecker.checkNotAuthenticated, (req, res) => {
	res.render('register');
});

router.post('/register', userController.createUser);

router.get('/login', authChecker.checkNotAuthenticated, (req, res) => {
	res.render('login');
});


router.post('/login', userController.login);

router.get('/logout', (req, res) => {
	res.clearCookie('token');
	res.redirect('login');
});

router.get("/401", (req, res)=>{
	res.status(401).render("401");
});



router.get('/', authChecker.authMiddleware , (req, res) =>{
	res.render('index', {user:req.user});
});

module.exports = router;
