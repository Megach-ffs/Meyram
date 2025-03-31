const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../users.json');

const userService = {
	readUsers() {
		if (!fs.existsSync(USERS_FILE)) return [];
		const data = fs.readFileSync(USERS_FILE);
		return JSON.parse(data);
	},

	writeUsers(users) {
		fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
	}
};

module.exports = userService;



