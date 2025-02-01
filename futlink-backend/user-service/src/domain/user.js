class User {
	constructor({
		id = null, // O ID virá do Firebase Auth
		username,
		cpf,
		birth = null,
		phone = null,
		email,
		password = null, // Apenas para autenticação
		profileImageUri = null,
		height = null,
		weight = null,
		primaryPosition = null,
		secondaryPosition = null,
		manager = false,
		address = null,
		createdAt = new Date(),
		updatedAt = new Date(),
	}) {
		this.id = id;
		this.username = username;
		this.cpf = cpf;
		this.birth = birth;
		this.phone = phone;
		this.email = email;
		this.profileImageUri = profileImageUri;
		this.height = height;
		this.weight = weight;
		this.primaryPosition = primaryPosition;
		this.secondaryPosition = secondaryPosition;
		this.manager = manager;
		this.address = address || {};
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	/** 🔥 Converte o objeto para ser salvo no Firestore */
	toFirestore() {
		return {
			username: this.username,
			cpf: this.cpf,
			birth: this.birth,
			phone: this.phone,
			email: this.email,
			profileImageUri: this.profileImageUri,
			height: this.height,
			weight: this.weight,
			primaryPosition: this.primaryPosition,
			secondaryPosition: this.secondaryPosition,
			manager: this.manager,
			address: this.address,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}

	/** 🔥 Converte os dados do Firestore para o Model */
	static fromFirestore(doc) {
		const data = doc.data();
		return new User({
			id: doc.id,
			...data,
		});
	}

	/** 🔒 Remove campos sensíveis antes de retornar para o frontend */
	sanitize() {
		const { password, ...safeData } = this;
		return safeData;
	}
}

module.exports = User;
