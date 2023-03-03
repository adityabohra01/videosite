import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Avatar, Box, Button, Collapse, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Stack, TextField, Typography, useMediaQuery } from "@mui/material"
import React, { useContext, useEffect, useRef, useState } from "react"
import LoaderUtils from "../../components/Loader/LoaderUtils"
import SnackbarUtils from "../../components/SnackbarUtils"
import AuthContext from "../../firebase/auth/AuthContext"
import PropTypes from "prop-types"

Comments.propTypes = {
    threadId: PropTypes.string,
    commentIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    setCommentIds: PropTypes.func.isRequired,
    setVideo: PropTypes.func,
    level: PropTypes.number,
    vid: PropTypes.string.isRequired
}

export default function Comments({ threadId, commentIds, setCommentIds, setVideo, level = 0, vid }) {
    const [comments, setComments] = useState([])
    const authContext = useContext(AuthContext)
    const commentRef = useRef(null)
    const [expanded, setExpanded] = useState([])
    const matches = useMediaQuery(theme => theme.breakpoints.down("sm"))

    useEffect(() => {
        setExpanded(new Array(comments.length).fill(false))
    }, [comments])

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
                threadId
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
            // if receiving a videoInfo data, that us commenting on main thread
            if (!threadId) {
                setVideo(video => ({
                    ...video,
                    ...data.data
                }))
                // add data.data.comment to start of comments
                setComments(comments => [
                    {
                        ...data.data.comment,
                        author: {
                            displayName: authContext.user.displayName,
                            photoURL: authContext.user.photoURL,
                            uid: authContext.user.uid
                        }
                    }
                ].concat(comments))
            }
            // otherwise it is a reply to a comment
            else {
                setCommentIds(commentIds => commentIds.concat(data.data._id))
                setComments(comments =>
                    comments.concat({
                        ...data.data,
                        author: {
                            displayName: authContext.user.displayName,
                            photoURL: authContext.user.photoURL,
                            uid: authContext.user.uid,
                        },
                    })
                )
            }

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
        if (commentIds.length === 0 || comments.length === commentIds.length) return
        const remaining = commentIds.length - comments.length
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
                comments: commentIds.slice().reverse().splice(comments.length, comments.length + (remaining > 20 ? 20 : remaining))
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

    function handleExpandClick (index) {
        setExpanded(expanded => {
            expanded[index] = !expanded[index]
            return [...expanded]
        })
    }

    useEffect(() => {
        if (threadId) loadComments()
    }, [threadId])

    return (
        <Box
            sx={{
                pl: level * 2,
                height: !threadId && "calc(100vh - 64px)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                maxWidth: matches ? threadId ? "100%" : "100%" : "40%" ,
                minWidth: 340,
                boxShadow: threadId && "0 0 10px 0 rgba(0,0,0,0.2)",
            }}
        >
            <Typography variant="h6" color="white.main" padding={2}>
                {threadId ? "Replies (" + commentIds.length + ")" : "Comments (" + commentIds.length + ")"}
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
                    placeholder={`Add a public ${threadId ? "Reply" : "Comment"}...`}
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
            <List
                sx={{
                    overflowY: threadId ? "visible" : "auto",
                }}
            >
                {comments.map((comment, index) => (
                    <>
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
                                        <span style={{ color: "white", fontWeight: "bold" }}>{comment?.author?.displayName}</span>
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2" color="grey" sx={{ paddingLeft: 1 }}>
                                        <span style={{ color: "white" }}> {comment?.comment}</span>
                                        <br></br>
                                        {new Date(comment?.timestamp).toDateString()}
                                    </Typography>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="expand" onClick={() => handleExpandClick(index)}>
                                    <span className="material-icons">{expanded[index] ? "expand_less" : "expand_more"}</span>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Collapse key={comment._id + "c"} in={expanded[index]} timeout="auto" unmountOnExit>
                            <Comments
                                threadId={comment._id}
                                commentIds={comment?.replies}
                                setCommentIds={ids =>
                                    setComments(c => {
                                        c[index].replies = c[index].replies.concat(ids)
                                        return c
                                    })
                                }
                                level={level + 1}
                                vid={vid}
                                key={comment._id}
                            />
                        </Collapse>
                    </>
                ))}
                {commentIds.length === 0 && (
                    <ListItem>
                        <Typography
                            variant="body1"
                            color="white.main"
                            sx={{
                                margin: "auto",
                            }}
                        >
                            No {threadId ? "Replies " : "Comments "} yet .
                        </Typography>
                    </ListItem>
                )}

                {commentIds.length > comments.length && (
                    <ListItem>
                        <Button
                            variant="text"
                            color="white"
                            onClick={loadComments}
                            startIcon={<span className="material-icons">update</span>}
                            sx={{
                                marginLeft: "auto",
                                marginRight: "auto",
                                paddingLeft: 2,
                                paddingRight: 2,
                            }}
                        >
                            Load {threadId ? "Replies" : "Comments"}
                        </Button>
                    </ListItem>
                )}
                {commentIds.length === comments.length && comments.length !== 0 && (
                    <ListItem>
                        <Typography
                            variant="body1"
                            color="grey"
                            sx={{
                                margin: "auto",
                            }}
                        >
                            End of {threadId ? "Replies" : "Comments "} .
                        </Typography>
                    </ListItem>
                )}
            </List>
        </Box>
    )
}