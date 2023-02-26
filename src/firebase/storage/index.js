import { firebaseApp } from "../index"
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage"

const storage = getStorage(firebaseApp)

// function to upload file to firebase storage
function uploadFile(path, file, onProgress) {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, path)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                if (onProgress)
                    onProgress(progress)
            },
            (error) => {
                console.error(error)
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                    console.log("File available at", downloadURL)
                    resolve(downloadURL)
                })
            }
        )
    })
}

export { uploadFile, storage }