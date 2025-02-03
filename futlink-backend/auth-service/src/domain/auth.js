class Auth {
	constructor({ id = null, username, password }) {
		this.id = id;
		this.username = username;
		this.password = password;
	}
}

module.exports = Auth;
