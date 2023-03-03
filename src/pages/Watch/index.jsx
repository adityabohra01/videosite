import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Avatar, Box, Button, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Stack, TextField, Typography, useMediaQuery } from "@mui/material"
import React, { useContext, useEffect, useRef, useState } from "react"
import LoaderUtils from "../../components/Loader/LoaderUtils"
import SnackbarUtils from "../../components/SnackbarUtils"
import AuthContext from "../../firebase/auth/AuthContext"
import webShareApi from "../../components/webShareAPI"
import Comments from "../../components/Comments"

export default function Watch() {
    const [vid, setVid] = useState(window.location.pathname.split("/")[2] || null)
    const videoRef = useRef(null)
    const commentRef = useRef(null)
    const [video, setVideo] = useState({
        author: "Aman Kumar",
        comments: [],
        description: "sfldsjbv oeuaruh fldajb flbls lkjwdj",
        length: 30.526667,
        likes: 0,
        thumbnailUrl:
            "https://firebasestorage.googleapis.com/v0/b/videosite-16374.appspot.com/o/files%2FCe3R9wUaGWT9dlxoxfgXTjtoZk42%2F1677706356413%2Fthumbnail.png?alt=media&token=078b73e7-00df-498e-af09-d125401e6e24",
        title: "another video finally",
        uid: "Ce3R9wUaGWT9dlxoxfgXTjtoZk42",
        videoUrl:
            "https://firebasestorage.googleapis.com/v0/b/videosite-16374.appspot.com/o/files%2FCe3R9wUaGWT9dlxoxfgXTjtoZk42%2F1677706356413%2Fvideo.mp4?alt=media&token=273ee94b-67ee-4f1c-b2fb-815f6b8ccc6d",
        views: 0,
        _id: "9f1766bda2d8172f81b416da",
        timestamp: 1637706356413,
        liked: false,
    })
    const [viewed, setViewed] = useState(false)
    const [comments, setComments] = useState([])
    const authContext = useContext(AuthContext)
    const matches = useMediaQuery("(min-width:756px)")

    useEffect(() => {
        if (!vid) return;
        setViewed(false);
        (async () => {
            LoaderUtils.halt()
            const res = await fetch(`/api/videoInfo/${vid}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authContext.user.token}`,
                },
            })
            const data = await res.json()
            if (data.error) {
                console.log(data.message)
                return
            }
            console.log(data)
            setVideo(data.data)
            LoaderUtils.unhalt()
        })()
    }, [vid, authContext.user])

    async function like (vid) {
        LoaderUtils.open()
        const result = await fetch("/api/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authContext.user.token}`,
            },
            body: JSON.stringify({
                videoId: vid,
                action: "toggleLike",
            }),
        })
        const data = await result.json()
        LoaderUtils.close()
        if (data.error) {
            console.log(data.message)
            SnackbarUtils.error(data.message || "Something went wrong")
            return
        }
        if (! video.liked) 
            SnackbarUtils.info("Liked 👍")
        else SnackbarUtils.info("Unliked 👎")
        setVideo({
            ...video,
            ...data.data,
        })
    }

    function addComment () {
        if (!commentRef.current.value) return
        LoaderUtils.open()
        fetch("/api/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authContext.user.token}`,
            },
            body: JSON.stringify({
                videoId: vid,
                action: "addComment",
                comment: commentRef.current.value,
            })
        })
        .then(res => res.json())
        .then(data => {
            LoaderUtils.close()
            if (data.error) {
                console.log(data.message)
                SnackbarUtils.error(data.message || "Something went wrong")
                return
            }
            console.log(data)
            setVideo({
                ...video,
                ...data.data
            })
            commentRef.current.value = ""
            SnackbarUtils.info("Comment added !")
        })
        .catch(err => {
            console.log(err)
            SnackbarUtils.error("Something went wrong")
        })
        .finally(() => {
            LoaderUtils.close()
        })
    }

    function loadComments () {
        console.log(video.comments.length, comments.length)
        if (video.comments.length === 0 || comments.length === video.comments.length) return
        const remaining = video.comments.length - comments.length
        LoaderUtils.open()
        fetch('api/action', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authContext.user.token}`,
            },
            body: JSON.stringify({
                videoId: vid,
                action: "getComments",
                comments: video.comments.slice(comments.length, comments.length + (remaining > 20 ? 20 : remaining))
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.log(data.message)
                SnackbarUtils.error(data.message || "Something went wrong")
                return
            }
            console.log(data)
            setComments(comments.concat(data.data))
        })
        .catch(err => {
            console.log(err)
            SnackbarUtils.error("Something went wrong")
        })
        .finally(() => {
            LoaderUtils.close()
        })
    }

    function timeUpdate () {
        if (videoRef.current.currentTime >= videoRef.current.duration * 0.5) 
            if (!viewed) {
                setViewed(true)
                fetch("/api/action", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authContext.user.token}`,
                    },
                    body: JSON.stringify({
                        videoId: vid,
                        action: "addView",
                    }),
                })
                setVideo(video => ({
                    ...video,
                    views: video.views + 1,
                }))
                console.log("viewed")
            }
    }

    return (
        <Box sx={{
            display: "flex",
            flexWrap: "nowrap",
            flexDirection: matches ? "row" : "column",
        }}>
            <Box id="video" sx={{
                width: "100%",
                maxWidth: 900,
            }}>
                <video
                    src={video.videoUrl}
                    controls
                    ref={videoRef}
                    style={{
                        width: "100%",
                    }}
                    onTimeUpdate={viewed ? undefined : timeUpdate}
                />
                <Accordion>
                    <AccordionSummary
                        expandIcon={
                            <IconButton>
                                <span className="material-icons">expand_more</span>
                            </IconButton>
                        }
                        aria-controls="video-description"
                    >
                        <Typography variant="h6">{video.title}</Typography>
                        <Button
                            variant="text"
                            color={video.liked ? "primary" : "white"}
                            startIcon={<span className="material-icons">thumb_up</span>}
                            sx={{
                                marginLeft: "auto",
                            }}
                            onClick={e => {
                                e.stopPropagation()
                                console.log("like")
                                like(video._id)
                            }}
                        >
                            {video.likes}
                        </Button>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="h6" color="white">
                            Description
                        </Typography>
                        <Typography variant="body2" color="grey">
                            {video.description}
                        </Typography>
                    </AccordionDetails>
                    {/* <AccordionActions>A</AccordionActions> */}
                </Accordion>
                <Stack direction="row" spacing={0} padding={2}>
                    <Typography variant="body2" color="white.main" sx={{ display: "flex", alignItems: "center" }}>
                        <span className="material-icons" style={{ marginRight: 8, color: "white" }}>
                            account_circle
                        </span>
                        <span style={{ color: "white" }}>{video.author}</span>
                    </Typography>
                    <Box sx={{ marginLeft: "auto" }}>
                        <Button variant="text" color="white" startIcon={<span className="material-icons">visibility</span>}>
                            {video.views}
                        </Button>
                        <IconButton
                            variant="text"
                            color="white"
                            onClick={() => {
                                webShareApi(window.location.href, video.title, video.description)
                                    .then(s => {
                                        if (s === false) SnackbarUtils.info("Link copied to clipboard")
                                    })
                                    .catch(e => {
                                        SnackbarUtils.error(e.message || "Something went wrong")
                                    })
                            }}
                        >
                            <span className="material-icons">share</span>
                        </IconButton>
                        <IconButton variant="text" color="white">
                            <span className="material-icons">more_vert</span>
                        </IconButton>
                    </Box>
                </Stack>
            </Box>
            {/* <Box>
                <Typography variant="h6" color="white.main" padding={2}>
                    Comments ({video.comments.length})
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: 2,
                    }}
                >
                    <Avatar
                        src={authContext?.user?.photoURL}
                        sx={{
                            width: 40,
                            height: 40,
                        }}
                    />
                    <TextField
                        placeholder="Add a public comment..."
                        variant="standard"
                        inputRef={commentRef}
                        sx={{
                            marginLeft: 2,
                            marginRight: 2,
                            width: "100%",
                        }}
                    />
                    <IconButton color="primary" onClick={addComment}>
                        <span className="material-icons">add_comment</span>
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    {comments.map(comment => (
                        <ListItem key={comment._id}>
                            <ListItemAvatar>
                                <Avatar
                                    src={comment?.author?.photoURL}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                    }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="body2" color="white">
                                        <span style={{ color: "white" }}>{comment?.author?.displayName}</span>
                                        <span style={{ color: "grey" }}> {comment?.text}</span>
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2" color="grey">
                                        {comment?.timestamp}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                    {video.comments.length === 0 && <ListItem>
                        <Typography variant="body1" color="white.main" sx={{
                            margin: "auto",
                        }}>
                            No Comments yet .
                        </Typography>
                    </ListItem>}

                    {(video.comments.length > comments.length) && (
                        <ListItem>
                            <Button variant="text" color="white" onClick={loadComments} startIcon={<span className="material-icons">update</span>} sx={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                paddingLeft: 2,
                                paddingRight: 2,
                            }}>
                                Load Comments
                            </Button>
                        </ListItem>
                    )}
                    {video.comments.length === comments.length && <ListItem>
                        <Typography variant="body1" color="grey" sx={{
                            margin: "auto",
                        }}>
                            End of comments .
                        </Typography>
                    </ListItem>}
                </List>
            </Box> */}
            <Comments
                video={video}
                commentIds={video.comments}
                setCommentIds={(ids) => setVideo({ ...video, comments: video.comments.concat(ids) })}
                vid={video._id}
                key={video._id}
                level={0}
                setVideo={setVideo}
                threadId={null}
            />
        </Box>
    )
}
