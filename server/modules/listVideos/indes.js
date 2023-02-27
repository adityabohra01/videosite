import { auth } from "../../firebase/auth/index.js";
import database from "../database/database.js";

async function listVideos (req, res) {
    try {
        const token = req.headers.authorization.split("Bearer ")[1]
        const decodedToken = await auth.verifyIdToken(token)

        if (!decodedToken.isUser) throw new Error({ status: 401, message: "User not authenticated" })

        const { query } = req.params

        // upload to mongodb database videos collection
        const result = await database.find({
            collection: "videos",
            // query: {
            //     $or: [
            //         { title: { $regex: query, $options: "i" } },
            //         { description: { $regex: query, $options: "i" } },

            // }
        })

        result.forEach((v, i, a) => {
            a[i].comments = a[i].comments.length
        })
        
        res.status(200).send({ error: false, message: "Found videos", data: result })

    } catch (error) {
        console.error(error)
        res.status(500).send({ error: true, message: error.message })
    }
}

export default listVideos