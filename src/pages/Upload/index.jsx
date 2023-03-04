import { Box, Stack, Typography, useTheme, TextField, useMediaQuery, Button, LinearProgress } from "@mui/material";
import React from "react";
import SnackbarUtils from "../../components/SnackbarUtils";
import getVideoCover from "../../components/getVideoCover";
import AuthContext from "../../firebase/auth/AuthContext";
import { uploadFile } from "../../firebase/storage";
import LoaderUtils from "../../components/Loader/LoaderUtils";
import { useNavigate } from "react-router-dom";

export default function Upload() {
    const theme = useTheme()
    const matches = useMediaQuery(theme => theme.breakpoints.down("sm"))
    const authContext = React.useContext(AuthContext);
    const navigate = useNavigate()
    const [videoUrl, setVideoUrl] = React.useState(null);
    const [progress, setProgress] = React.useState(null);
    const title = React.useRef(null);
    const description = React.useRef(null);
    const video = React.useRef(null);
    const videoElement = React.useRef(null);

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        // file contains video, use getVideoCover to get the thumbnail
        // getVideoCover(file).then((cover) => {
        setVideoUrl(URL.createObjectURL(file));
        
        // }).catch((err) => {
        //     console.log(err);
        // });
    }

    const upload = async () => {
        setProgress(0)
        // check if file is selected
        // check if title and description are filled
        // checck if file size is less than 500MB
        // upload video to firebase storage
        // upload thumbnail to firebase storage
        // send video details to backend

        const file = video.current.files[0];
        const titleValue = title.current.value;
        const descriptionValue = description.current.value;

        if (!file) {
            SnackbarUtils.warning("Please select a video");
            return;
        }

        if (!titleValue || !descriptionValue) {
            SnackbarUtils.warning("Please fill title and description");
            return;
        }

        if (file.size > 500 * 1024 * 1024) {
            SnackbarUtils.warning("Video size should be less than 500MB");
            return;
        }
        LoaderUtils.halt()
        const videoId = Date.now()
        // generate path for video and thumbnail as storage/uid/videoId/video
        const basePath = `files/${authContext.user.uid}/${videoId}/`;
        // file + extension
        const videoPath = `${basePath}/video.${file.name.split(".").pop()}`;
        const thumbnailPath = `${basePath}/thumbnail.png`;
        // get thumbnail from video
        SnackbarUtils.info("Generating thumbnail")
        const thumbnail = await getVideoCover(file)
        // upload thumbnail to firebase storage
        const thumbnailPromise = uploadFile(thumbnailPath, thumbnail);
        // upload video to firebase storage
        const videoPromise = uploadFile(videoPath, file, setProgress);

        // wait for all to complete
        SnackbarUtils.info("Uploading files")
        const [videoUrl, thumbnailUrl] = await Promise.all([videoPromise, thumbnailPromise]);

        // send video details to backend
        fetch("/api/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authContext.user.token}`
            },
            body: JSON.stringify({
                videoId,
                title: titleValue,
                description: descriptionValue,
                videoUrl,
                thumbnailUrl,
                length: videoElement.current.duration,
                author: authContext.user.displayName,
            })
        }).then((res) => res.json()).then((data) => {
            if (data.error) {
                SnackbarUtils.error("Something went wrong");
                return
            }
            SnackbarUtils.success("Video uploaded successfully");
            LoaderUtils.unhalt()
            navigate("/")
        }).catch((err) => {
            console.log(err);
            SnackbarUtils.error("Something went wrong");
            LoaderUtils.unhalt()
        })

    }

    return (
        <Box padding={4}>
            <Typography variant="h4" color={theme.palette.white.main}>
                Upload Video
            </Typography>
            <div
                style={{
                    display: "flex",
                    marginTop: 16,
                    flexDirection: matches ? "column" : "row",
                }}
            >
                <Stack spacing={2} direction="column" width="100%" maxWidth={800} margin={matches ? 0 : 4}>
                    <TextField label="Title" inputRef={title} type="text" />
                    <TextField multiline minRows={3} maxRows={9} label="Description" inputRef={description} type="text" />
                    <TextField label="Video" inputRef={video} type="file" onChange={handleVideoChange} />
                </Stack>
                {matches && <LinearProgress variant="determinate" value={progress} style={{ width: "100%", marginTop: 16 }} />}
                {videoUrl ? (
                    <div>
                        <video
                            ref={videoElement}
                            autoPlay
                            muted
                            controls
                            src={videoUrl || null}
                            style={{
                                width: "100%",
                                margin: matches ? 0 : 32,
                            }}
                        ></video>
                    </div>
                ) : (
                    <div
                    style={{
                        width: "100%",
                        margin: matches ? 0 : 32,
                        height: 200,
                        backgroundColor: theme.palette.black.main,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                        <Typography variant="h6" color={theme.palette.white.main}>
                            Choose Video
                        </Typography>
                    </div>
                )}
            </div>
            {!matches && <LinearProgress variant="determinate" value={progress} style={{ width: "calc(100% - 64px)", margin: "0px 32px" }} />}
            <Button  variant="contained" color="primary" style={{ width: matches ? "100%": 300, margin: matches ? "16px 0" : "32px 32px", float: "right" }} onClick={upload}>
                Upload
            </Button>
        </Box>
    )
}