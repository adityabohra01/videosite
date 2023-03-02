import { MongoClient } from "mongodb"
// let collections = ["users", "videos", "comments"]


class Database {
    constructor (url) {
        this.flag = false
        MongoClient.connect(url).then(async (dbp) => {
            this.client = dbp
            console.log("DB connected !")
            this.db = dbp.db('videoSite')
            console.log("DB connected !")
            // try {
            //     collections.forEach((v, index, arr) => {
            //         // this.db.createCollection(v, (err, res) => {
            //         //     if (err && err.codeName === "NamespaceExists") {
            //         //         // console.log(err)
            //         //         arr.length = index + 1
            //         //         this.flag = true
            //         //         console.log(`Collection ${v} exists !`)
            //         //     } else if (!err) console.log("Collection created !")
            //         // })
            //         try {
            //             this.db.createCollection(v)
            //              console.log("Collection created !", v)
            //         } catch (error) {
            //             // if (error.codeName === "NamespaceExists") {
            //             //     // console.log(err)
            //             //     arr.length = index + 1
            //             //     this.flag = true
            //             //     console.log(`Collection ${v} exists !`)
            //             // } else throw error
            //         }

            //     })
            // } catch (error) {
            //     if (! this.flag) {
            //         console.log("\n-------Serious Error !-------\n")
            //         // throw error
            //     } else console.log("colection already exists, chill")
            // }
        })
        .catch((err) => {
            throw err
        })
    }

    insertOne = ({collection, data}) => {
        return this.db.collection(collection).insertOne(data)
    }

    insertMany = ({collection, data}) => {
        return this.db.collection(collection).insertMany(data)
    }

    findOne = ({collection, query}) => {
        return this.db.collection(collection).findOne(query)
    }

    deleteOne = ({collection, query}) => {
        return this.db.collection(collection).deleteOne(query)
    }

    updateOne = ({collection, query, data}) => {
        return this.db.collection(collection).updateOne(query, {$set : data }, { multi: false, runValidators: true, omitUndefined: true })
    }

    find = ({collection, query, limit = 99999999, sort = {}, projection = {}}) => {
        return this.db.collection(collection).find(query, {projection}).sort(sort).limit(limit).toArray()
    }
}
const database = new Database(process.env.MONGODB_URI)
export default database
