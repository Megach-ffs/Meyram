const {body} = require('express-validator');

const userValidator = {
	register: [
		body('username')
			.trim()
			.notEmpty().withMessage('Username is required')
			.isLength({min:4}).withMessage('The length of username must be at least 4 chars'),

		body('email')
			.trim()
			.isEmail().withMessage('Enter a valid email'),

		body('password')
			.notEmpty().withMessage('Password is required')
			.isLength({min:8}).withMessage('Password must have at least 8 characters'),

		body('name')
			.optional({ checkFalsy: true })
			.isAlpha().withMessage('Enter only conventional names, dont be elon'),

		body('surname')
			.optional({ checkFalsy: true })
			.isAlpha().withMessage('It must contain only letters (how didnt you get it)'),

		body('description')
			.optional({ checkFalsy: true })
			.isLength({max:400}).withMessage('too much yapping, no one cares')
	],

	
	update: [
		body('email')
			.optional({ checkFalsy: true })
			.isEmail().withMessage('Email must be valid'),

		body('password')
			.optional({ checkFalsy: true })
			.isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

		body('name')
			.optional({ checkFalsy: true })
			.isAlpha().withMessage('Enter only conventional names'),

		body('surname')
			.optional({ checkFalsy: true })
			.isAlpha().withMessage('only letters, my friend'),

		body('description')
			.optional({ checkFalsy: true })
			.isLength({ max: 400 }).withMessage('bro, chill out')
	]};

module.exports = userValidator;

