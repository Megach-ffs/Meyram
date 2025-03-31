const express = require("express");
const router = express.Router();

router.get('/', (req, res) =>{
	res.send("hellow illa");
});
module.exports = router;
