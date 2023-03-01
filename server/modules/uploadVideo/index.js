import { ObjectId } from "mongodb"
import { auth } from "../../firebase/auth/index.js"
import database from "../database/database.js"



async function uploadVideo (req, res) {
    try {
        const idToken = req.headers.authorization.split("Bearer ")[1]
        const decodedToken = await auth.verifyIdToken(idToken)

        if (!decodedToken.uid) throw new Error({ status: 401, message: "User not authenticated" })
        if (!decodedToken.isCreator) throw new Error({ status: 403, message: "User not authorised" })

        const { author, videoId, title, description, videoUrl, thumbnailUrl, length } = req.body
        // check if values are valid
        if (!videoId || !title || !description || !videoUrl || !thumbnailUrl || !length || !author) throw new Error({ status: 400, message: "Invalid request" })

        // upload to mongodb database videos collection
        const result = await database.insertOne({
            collection: "videos",
            data: {
                _id: new ObjectId(videoId),
                title,
                description,
                videoUrl,
                thumbnailUrl,
                length,
                author,
                uid: decodedToken.uid,
                views: 0,
                likes: 0,
                comments: []
            }
        })

        res.status(200).send({ error: false, message: "Video uploaded successfully" })

    } catch (error) {
        console.error(error)
        res.status(500).send({ error: true, message: error.message })
    }
}

export default uploadVideo