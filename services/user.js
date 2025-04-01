const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../users.json');

function genId(length = 6) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let id = '';
	for (let i = 0; i < length; i++) {
		id += chars[Math.floor(Math.random() * chars.length)];
	}
	return id;
}

const userService = {
	getAll() {
		if (!fs.existsSync(USERS_FILE)) return [];
		const data = fs.readFileSync(USERS_FILE);
		return JSON.parse(data);
	},

	getById(id) {
		const users = this.getAll();
		return users.find(u => u.id === id);
	},

	createUser(data) {
		const users = this.getAll();
		const newId = genId();
		const user = {
			username: data.username,
			name: data.name || '',
			surname: data.surname || '',
			email: data.email,
			desc: data.description || '',
			password: data.password
		};

		users.push({ id: newId, user });
		this.writeUsers(users);
		return { id: newId, user };
	},

	updateUser(id, newData) {
		const users = this.getAll();
		const index = users.findIndex(u => u.id === id);
		if (index === -1) return null;

		users[index] = {
			id,
			user: {
				...users[index].user,
				...newData
			}
		};

		this.writeUsers(users);
		return users[index];
	},

	deleteUser(id) {
		let users = this.getAll();
		const initialLength = users.length;
		users = users.filter(u => u.id !== id);

		if (users.length === initialLength) return false;

		this.writeUsers(users);
		return true;
	},

	writeUsers(users) {
		fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
	}
};

module.exports = userService;


