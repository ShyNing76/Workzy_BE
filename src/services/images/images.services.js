import { v4 as uuidv4 } from "uuid";
import storage from "../../config/firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImageService = (file) => {
    return new Promise((resolve, reject) => {
        const fileExtension = file.originalname.split(".").pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const storageRef = ref(storage, `images/${fileName}`);

        uploadBytes(storageRef, file.buffer)
            .then((snapshot) => getDownloadURL(snapshot.ref))
            .then((downloadURL) => {
                resolve({
                    success: true,
                    message: "Image uploaded successfully",
                    imageUrl: downloadURL,
                    fileName: fileName,
                });
            })
            .catch((error) => {
                console.error("Error uploading image:", error);
                reject(new Error("Failed to upload image"));
            });
    });
};
