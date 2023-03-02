import { auth } from "../../firebase/auth/index.js"
import { ObjectId } from "mongodb"
import database from "../database/index.js"

async function videoInfo (req, res) {
    try {
        const token = req.headers.authorization.split("Bearer ")[1]
        const decodedToken = await auth.verifyIdToken(token)
    
        if (!decodedToken.isUser) throw new Error({ status: 401, message: "User not authenticated" })
    
        const { videoId } = req.params
    
        // upload to mongodb database videos collection
        const result = await database.find({
            collection: "videos",
            query: {
                // mongodb query to find record with videoId in videos collection
                _id: new ObjectId(videoId)
            }
        })
    
        if (!result || result.length === 0) throw new Error({ status: 404, message: "Video not found" })

        // get liked state
        const liked = result[0].likes.includes(decodedToken.uid)
        // update in result[0]
        result[0].liked = liked
        result[0].likes = result[0].likes.length
    
        res.status(200).send({ error: false, message: "Found video", data: result[0] })
        
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: true, message: error.message })   
    }
}

export default videoInfo