import { launchImageLibrary } from "react-native-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import { v4 as uuidv4 } from "uuid";

export const pickAndUploadMedia = () => {
  return new Promise((resolve, reject) => {
    launchImageLibrary({ mediaType: "mixed" }, async (response) => {
      if (response.didCancel) return reject("Cancelado pelo usuário");
      const asset = response.assets?.[0];
      if (!asset?.uri) return reject("Mídia inválida");

      try {
        const response = await fetch(asset.uri);
        const blob = await response.blob();

        const fileName = `${uuidv4()}-${asset.fileName}`;
        const fileRef = ref(storage, `posts/${fileName}`);

        await uploadBytes(fileRef, blob);
        const downloadUrl = await getDownloadURL(fileRef);

        resolve({ mediaUrl: downloadUrl });
      } catch (err) {
        reject("Erro no upload: " + err.message);
      }
    });
  });
};
