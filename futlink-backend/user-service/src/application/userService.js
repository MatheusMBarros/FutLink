const { db, bucket, auth } = require("../infrastructure/firebaseConfig");
const User = require("../domain/user");

class UserService {
	createUser(data) {
		return new Promise(async (resolve, reject) => {
			try {
				this.validateData(data);

				const uid = await this.createUserInAuth(data);

				const user = await this.createUserInFirebase(data, uid);

				resolve(user);
			} catch (error) {
				reject(error);
			}
		});
	}

	validateData = async (data) => {
		const usersRef = db.collection("users");

		const [usernameQuery, emailQuery, cpfQuery] = await Promise.all([
			usersRef.where("username", "==", data.username).get(),
			usersRef.where("email", "==", data.email).get(),
			usersRef.where("cpf", "==", data.cpf).get(),
		]);

		// Agora você pode verificar se os dados já existem
		if (!usernameQuery.empty) {
			throw new Error("Username já está em uso.");
		}

		if (!emailQuery.empty) {
			throw new Error("Email já está em uso.");
		}

		if (!cpfQuery.empty) {
			throw new Error("CPF já está cadastrado.");
		}

		//senha maior que 5 caracteres
		if (data.password.length < 5) {
			throw new Error("Senha deve conter no mínimo 5 caracteres.");
		}
	};

	createUserInAuth = async (data) => {
		try {
			const userRecord = await auth.createUser({
				email: data.email,
				emailVerified: false,
				phoneNumber: data.phone,
				password: data.password,
				displayName: data.username,
				photoURL: data.profileImageUri,
				disabled: false,
			});
			return userRecord.uid;
		} catch (error) {
			console.error(error);
			throw new Error("Erro ao criar novo usuário: " + error.message);
		}
	};

	createUserInFirebase = async (data, authId) => {
		let address = this.parseAddress(data.address);

		const user = new User({
			id: authId,
			username: data.username,
			cpf: data.cpf,
			birth: data.birth,
			phone: data.phone,
			email: data.email,
			profileImageUri: data.profileImageUri,
			height: data.height,
			weight: data.weight,
			primaryPosition: data.primaryPosition,
			secondaryPosition: data.secondaryPosition,
			manager: data.manager,
			address: address,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});

		await db.collection("users").doc(authId).set({
			username: data.username,
			cpf: user.cpf,
			birth: user.birth,
			phone: user.phone,
			email: user.email,
			profileImageUri: user.profileImageUri,
			height: user.height,
			weight: user.weight,
			primaryPosition: user.primaryPosition,
			secondaryPosition: user.secondaryPosition,
			manager: user.manager,
			address: user.address,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		});
		return user;
	};

	parseAddress = (address) => {
		try {
			return JSON.parse(address);
		} catch (error) {
			throw new Error("Invalid address format. Must be a valid JSON string.");
		}
	};

	uploadProfileImage = async (profileFile) => {
		const profileImage = profileFile;
		const nomeArquivo =
			Date.now() + "." + profileImage.originalname.split(".").pop();
		const file = bucket.file("profileImage/" + nomeArquivo);

		const stream = file.createWriteStream({
			metadata: {
				contentType: profileImage.mimetype,
			},
		});

		return new Promise((resolve, reject) => {
			stream.on("error", (e) => {
				console.error(e);
				reject(new Error("Ocorreu um erro ao fazer o upload do arquivo"));
			});

			stream.on("finish", async () => {
				await file.makePublic();
				const firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
				resolve({ firebaseUrl });
			});

			stream.end(profileImage.buffer);
		});
	};

	getUser = async (userId) => {
		try {
			const userDoc = await db.collection("users").doc(userId).get();

			if (!userDoc.exists) {
				console.log("Usuário não encontrado.");
				return null;
			}

			return { id: userDoc.id, ...userDoc.data() }; // Retorna o ID do documento junto com os dados do usuário
		} catch (error) {
			console.error("Erro ao buscar usuário:", error);
			return null;
		}
	};
}

module.exports = new UserService();
