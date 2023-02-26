import { Backdrop, CircularProgress } from "@mui/material"
import LinearProgress from "@mui/material/LinearProgress"
import React, { useEffect, useState } from "react"
import LoaderUtils from "./LoaderUtils"

const Loader = props => {
    const providerRef = React.useRef()
    const [ loading, setLoading ] = useState(true)
    const [halt, setHalt] = useState(true)
    LoaderUtils.setLoader(loading, setLoading, halt, setHalt)
    useEffect(() => {
        //2. Store both  enqueueSnackbar & closeSnackbar to class variables
        LoaderUtils.setLoader(loading, setLoading, halt, setHalt)
    }, [])
    return (
        <>
            {!loading ? (
                <LinearProgress
                    ref={providerRef}
                    color="secondary"
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        zIndex: "1000000",
                        width: "100%",
                    }}
                ></LinearProgress>
            ) : null}
            { halt ? <Backdrop sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 100 }} open={halt} >
                <CircularProgress color="inherit" sx={{ zIndex: 500 }}/>
            </Backdrop> : null }
            {props.children}
        </>
    )
}

export default Loader
