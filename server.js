import path, {dirname} from "path"
import { fileURLToPath } from "url"
import express from "express"
import { config } from "dotenv"
import bodyParser from "body-parser"
import { setRole } from "./server/firebase/auth/index.js"
import uploadVideo from "./server/modules/uploadVideo/index.js"
import listVideos from "./server/modules/listVideos/indes.js"
import videoInfo from "./server/modules/videoInfo/index.js"
import action from "./server/modules/action/index.js"
import database from "./server/modules/database/index.js"

config()
const arr = ["log", "warn", "error"].forEach(methodName => {
    const originalMethod = console[methodName]
    console[methodName] = (...args) => {
        let initiator = "unknown place"
        try {
            throw new Error()
        } catch (e) {
            if (typeof e.stack === "string") {
                let isFirst = true
                for (const line of e.stack.split("\n")) {
                    const matches = line.match(/^\s+at\s+(.*)/)
                    if (matches) {
                        if (!isFirst) {
                            // first line - current function
                            // second line - caller (what we are looking for)
                            initiator = "\x1b[33m at " + matches[1] + "\x1b[0m"
                            break
                        }
                        isFirst = false
                    }
                }
            }
        }
        originalMethod.apply(console, [...args, "\n", initiator])
    }
})

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 3069
    
app.use(express.json())
app.use((req, res, next) => {
    // log ip addresses of requests to mongodb
    const ip = req.headers["x-forwarded-for"] || req.ip
    if (ip === "::1") return next()
    // write only unique ip addresses otherwise update url and timestamp
    database.collection("ipAddresses").updateOne(
        { ip },
        { $set: { url: req.url, timestamp: new Date() } },
        { upsert: true }
    )
    next()
})
// app.use(isAdmin)
// app.get("/", (req, res) => res.send("Hello World!"))
app.get("/api/setRole/:role", setRole)
app.get("/api/listVideos/:query", listVideos)
app.get("/api/videoInfo/:videoId", videoInfo)
app.post("/api/upload", uploadVideo)
app.post("/api/action", action)
// static resources should just be served as they are
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.resolve(__dirname, "dist"), { maxAge: "30d" }))
app.get('*', (req, res) => {
    console.log(req.url)
    res.sendFile(path.join(__dirname + '/dist/index.html'))
})


app.listen(PORT, error => {
    if (error) {
        return console.log("Error during app startup", error)
    }
    console.log("listening on " + PORT + "...")
})