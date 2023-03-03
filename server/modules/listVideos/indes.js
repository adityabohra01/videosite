import { auth } from "../../firebase/auth/index.js";
import database from "../database/index.js";

async function listVideos (req, res) {
    try {
        const token = req.headers.authorization.split("Bearer ")[1]
        const decodedToken = await auth.verifyIdToken(token)

        if (!decodedToken.email) throw new Error({ status: 401, message: "User not authenticated" })

        // const { query } = req.params

        // upload to mongodb database videos collection
        const result = await database.find({
            collection: "videos",
            // exclude comments
            projection: {
                comments: 0
            }
            // query: {
            //     // mongodb query to find record with videoId in videos collection
            //     _id: videoId
            // }
        })

        result.forEach((v, i, a) => {
            a[i].likes = a[i].likes.length
        })
        
        res.status(200).send({ error: false, message: "Found videos", data: result })

    } catch (error) {
        console.error(error)
        res.status(500).send({ error: true, message: error.message })
    }
}

export default listVideos