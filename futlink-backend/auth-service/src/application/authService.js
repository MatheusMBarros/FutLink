import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

async function loginUser(email, password) {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const token = await userCredential.user.getIdToken(); // Token JWT
		console.log("Token:", token);
		return token;
	} catch (error) {
		console.error("Erro ao fazer login:", error.message);
		return null;
	}
}
