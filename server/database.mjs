import { MongoClient } from "mongodb"

let collections = ["users"]


class Database {
    constructor (url) {
        this.flag = false
        MongoClient.connect(url, async (err, dbp) => {
            if (err) throw err
            this.client = dbp
            this.db = dbp.db('videoSite')
            console.log("DB connected !")
            try {
                collections.forEach((v, index, arr) => {
                    this.db.createCollection(v, (err, res) => {
                        if (err && err.codeName === "NamespaceExists") {
                            // console.log(err)
                            arr.length = index + 1
                            this.flag = true
                            console.log(`Collection ${v} exists !`)
                        } else if (!err) console.log("Collection created !")
                    })
                })
            } catch (error) {
                if (! this.flag) {
                    console.log("\n-------Serious Error !-------\n")
                    // throw error
                } else console.log("colection already exists, chill")
            }
        })
    }

    insertOne = ({collection, data}) => {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).insertOne(data, (err, res) => {
                if (err) reject(err)
                else resolve(res)
            })
        })
    }

    insertMany = ({collection, data}) => {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).insertMany(data, (err, res) => {
                if (err) reject(err)
                else resolve(res)
            })
        })
    }

    findOne = ({collection, query}) => {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).findOne(query, (err, result) => {
                if (err) reject(err)
                else resolve(result)
            })
        })
    }

    deleteOne = ({collection, query}) => {
        return new Promise((resolve, reject) => {
            console.log(query)
            this.db.collection(collection).deleteOne(query, (err, result) => {
                if (err) reject(err)
                else resolve(result)
            })
        })
    }

    updateOne = ({collection, query, data}) => {
        return new Promise((resolve, reject) => {
            console.log(query)
            this.db.collection(collection).updateOne(query, {$set : data }, { multi: false, runValidators: true, omitUndefined: true }, (err, result) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else resolve(result)
            })
        })
    }

    find = ({collection, query, limit = 99999999, sort = {}, projection = {}}) => {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).find(query, {projection}).sort(sort).limit(limit).toArray((err, result) => {
                if (err) reject(err)
                else resolve(result)
            })
        })
    }
}

export default new Database(process.env.MONGODB_URI)
