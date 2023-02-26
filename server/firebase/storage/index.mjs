import firebaseApp from "../index.mjs";
import { getStorage } from "firebase-admin/storage"


class Storage {
    constructor () {
        this.storage = getStorage(firebaseApp)
        console.log("storage initialised")
        this.adRef = this.storage.bucket()
        // console.log(this.adRef)
        
    }

    uploadAdImage(data) {
        return new Promise((resolve, reject) => {
            const fileRef = this.adRef.file(`Ads/${data.originalname}`)
            const imgBuffer = new Uint8Array(data.buffer)
            fileRef.save(imgBuffer, ((error) => {
                if (error) reject(error)
                // fileRef.setMetadata({
                //     contentType: data.mimetype,
                // })
                // resolve(fileRef.publicUrl())
                fileRef.getSignedUrl({ action: "read", expires: "01-01-2099" }).then(results => {
                    resolve(results[0])
                })
            }))
        })
    }
    upload(folderPath, data) {
        return new Promise((resolve, reject) => {
            const fileRef = this.adRef.file(`${folderPath}/${data.originalname}`)
            const imgBuffer = new Uint8Array(data.buffer)
            fileRef.save(imgBuffer, ((error) => {
                if (error) reject(error)
                // fileRef.setMetadata({
                //     contentType: data.mimetype,
                // })
                // resolve(fileRef.publicUrl())
                fileRef.getSignedUrl({ action: "read", expires: "01-01-2099" }).then(results => {
                    resolve(results[0])
                })
            }))
        })
    }

    deleteFile(filePath) {
        return new Promise((resolve, reject) => {
            const fileRef = this.adRef.file(filePath)
            fileRef.delete().then((res) => resolve(res)).catch(err => reject(err))
        })
    }

}


export default new Storage()