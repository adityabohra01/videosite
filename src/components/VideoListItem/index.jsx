import { Avatar, Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css"

// function to convert seconds to HH:MM:SS format
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + " : " : "";
    var mDisplay = m > 0 ? m + " : " : "0 :";
    var sDisplay = s > 0 ? s + " " : "00";
    return hDisplay + mDisplay + sDisplay;
}

function stringToColor(string) {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = "#"

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff
        color += `00${value.toString(16)}`.slice(-2)
    }
    /* eslint-enable no-bitwise */

    return color
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            height: 24,
            width: 24,
        },
        children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    }
}

export default function VideoListItem({ video }) {
    const navigate = useNavigate()
    const theme = useTheme()

    return (
        <div className="videoList" key={video.videoId || video._id} onClick={() => {
            navigate(`/watch/${video.videoId || video._id}`)
        }}>
            <img src={video.thumbnailUrl} alt="thumbnail" />
            <div className="duration">{secondsToHms(video.length)}</div>
            <div className="views">
                <span className="material-icons">visibility</span>
                <span>{video.views}</span>
            </div>
            <Box
                sx={{
                    display: "flex",
                    position: "relative",
                }}
            >
                <Stack className="title" sx={{ padding: 1, paddingLeft: 2, width: "calc(100% - 100px)" }}>
                    <Typography variant="h6" color={"white"}>
                        {video.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <span className="material-icons" style={{ color: theme.palette.grey.A100 }}>
                            account_circle
                        </span>
                        <Typography variant="body2" color="grey">
                            {video.author}
                        </Typography>
                    </Stack>
                </Stack>
                <div className="stats">
                    <span className="material-icons">thumb_up</span>
                    <span>{video.likes}</span>
                </div>
            </Box>
        </div>
    )
}