import database from "../database/index.js";
import { ObjectId } from "mongodb";
import { auth } from "../../firebase/auth/index.js";


async function toggleLike (videoId, uid) {
    // update the video document in the database by adding or removing the user id from the likes array in the document and return the updated document
    // in a single operation using the mongodb updateOne method
    // filter by videoId and value in like array

    const result = await database.db.collection("videos").findOneAndUpdate({ _id: new ObjectId(videoId) }, [
        {
            $set: {
                likes: {
                    $cond: {
                        if: { $in: [uid, "$likes"] },
                        then: {
                            $filter: {
                                input: "$likes",
                                cond: { $ne: ["$$this", uid] },
                            },
                        },
                        else: { $concatArrays: ["$likes", [uid]] },
                    },
                },
            },
        },
    ], { returnDocument: "after" })

    return result.value
}

async function addComment(videoId, comment, uid, threadId) {
    const _id = new ObjectId()
    const document = {
        _id,
        comment,
        uid,
        replies: [],
        timestamp: Date.now(),
    }

    // start a transaction
    const session = database.client.startSession()

    
    let result = {}
    try {
        session.startTransaction()
        // update the video document in the database by adding the comment to the comments array in the document and return the updated document
        // in a single operation using the mongodb updateOne method
        // filter by videoId and value in like array
        await database.db.collection("comments").insertOne(document, { session })
        
        // if reply, update the comment document in the database by adding the comment to the replies array in the document and return the updated document
        if (threadId) {
            await database.db.collection("comments").findOneAndUpdate({ _id: new ObjectId(threadId) }, [
                {
                    // update the comments array
                    $set: {
                        replies: {
                            // update to the start of the array
                            $concatArrays: [[_id], "$replies"],
                        },
                    },
                },
            ], { returnDocument: "after" }, { session })
            result.value = document
            result.value._id = result.value._id.toString()
        }
        else {
            result = await database.db.collection("videos").findOneAndUpdate({ _id: new ObjectId(videoId) }, [
                {
                    // update the comments array
                    $set: {
                        comments: {
                            // update to the start of the array
                            $concatArrays: [[_id], "$comments"],
                        },
                    },
                },
            ], { returnDocument: "after" }, { session })
            result.value.comment = document
            result.value.comment._id = result.value.comment._id.toString()
        }

        await session.commitTransaction()
    } catch (error) {
        console.error(error)
        await session.abortTransaction()
    } finally {
        session.endSession()
    }

    return result.value
}

async function getComments(comments) {
    // get all the comments from the database using the comment ids in the comments array
    // use firebase-admin to get the user data for each comment
    // return the comments array with the user data added to each comment

    if (!comments.length || comments.length > 100) throw new Error({ status: 400, message: "Invalid comments array size" })

    const result = await database.db.collection("comments").find({ _id: { $in: comments.map((v) => new ObjectId(v)) } }).toArray()
    const uids = new Array(...new Set(result.map((v) => v.uid)))
    console.log(uids)
    const users = await auth.getUsers(uids.map((v) => ({ uid : v })))
    

    return result.map((v) => {
        const u = users.users.find((u) => u.uid === v.uid)
        v.author = {
            displayName: u.displayName,
            photoURL: u.photoURL,
            uid: u.uid,
        }
        return v
    })

}


async function action(req, res) {
    try {
        const token = req.headers.authorization.split("Bearer ")[1]
        const decodedToken = await auth.verifyIdToken(token)
    
        if (!decodedToken.isUser)
            throw new Error({ status: 401, message: "User not authenticated" })
    
        const actionData = req.body
    
        let result;
        switch (actionData.action) {
            case "toggleLike":
                result = await toggleLike(actionData.videoId, decodedToken.uid)
                break;
            case "addComment":
                result = await addComment(actionData.videoId, actionData.comment, decodedToken.uid, actionData.threadId)
                break;
            case "getComments":
                result = await getComments(actionData.comments)
                break;
            default:
                throw new Error({ status: 400, message: "Invalid action" })
        }

        if (result?.likes) {
            if (result.likes.includes(decodedToken.uid)) result.liked = true
            else result.liked = false
            result.likes = result.likes.length
        }

    
        res.status(200).send({ error: false, message: "Success", data: result});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: true, message: error.message });
    }
}

export default action