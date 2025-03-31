const express = require('express');
const jwt = require('jsonwebtoken');

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
const authChecker = {
authMiddleware,
	checkNotAuthenticated
};
module.exports = authChecker;

