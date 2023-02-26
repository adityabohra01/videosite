import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import TablePagination from "@mui/material/TablePagination"
import { doc, onSnapshot, collection, query, orderBy, startAfter, limit, endBefore, limitToLast, getDocs, collectionGroup } from "firebase/firestore"
import { useTheme } from "@emotion/react"
import firestore from "../../firebase/firestore";
import { useMediaQuery } from "@mui/material";
import LoaderUtils from "../../components/Loader/LoaderUtils";

export default function LeaderBoard() {
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down("sm"))

    const [scoreLists, setScoreLists] = useState([])
    const [unsub, setUnsub] = useState(null)

    // Total count of records
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(100)
    const handleChangePage = (event, newPage) => {
        LoaderUtils.open()
        // console.log("page changed", newPage)
        if (unsub) {
            unsub()
            setUnsub(null)
        }
        const first = query(
            collection(firestore, "scores"),
            orderBy("score", "desc"),
            newPage > page ? startAfter(scoreLists[scoreLists.length - 1].Timestamp) : endBefore(scoreLists[0].Timestamp),
            newPage > page ? limit(rowsPerPage) : limitToLast(rowsPerPage)
        )
        let arr = []
        const subscription = onSnapshot(first, (querySnapshot) => {
            // console.log("got data")
            // console.log(querySnapshot)
            querySnapshot.forEach(doc => {
                arr.push(doc.data())
                // console.log("New city: ", doc.data())
            })
            setScoreLists(arr)
        })

        setTimeout(() => {
            setUnsub(subscription)
            LoaderUtils.close()
        }, 5000)
        setPage(newPage)
    }

    useEffect(() => {
        LoaderUtils.open()
        // console.log("useEffect called")
        const first = query(collection(firestore, "scores"), orderBy("score", "desc"), limit(rowsPerPage))
        let arr = []
        // console.log("first")
        // getDocs(first).then((querySnapshot) => {
        //     console.log("got data")
        //     console.log(querySnapshot)
        //     querySnapshot.forEach(doc => {
        //             arr.push(doc.data())
        //             console.log("New city: ", doc.data())
        //     })
        //     setScoreLists(arr)
        // })
        let unsubscribe = onSnapshot(
            first,
            querySnapshot => {
                // console.log("got data")
                querySnapshot.forEach(doc => {
                    arr.push(doc.data())
                    // console.log("New city: ", doc.data())
                })
                setScoreLists(arr)
            });

        setTimeout(() => {
            setUnsub(unsubscribe)
            LoaderUtils.close()
        }, 5000)
        // setUnsub(unsubscribe)
    }, [])

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 100))
        setPage(0)
    }
    const [playerCount, setPlayerCount] = useState(0)
    useEffect(() => {
        setPage(0);
        (async () => {
            onSnapshot(doc(firestore, "utils", "info"), doc => {
                // console.log("Current data: ", doc.data())
                setPlayerCount(doc.data().count)
            })
        })()
    }, [])

    return (
        <div>
            <div>
                <TableContainer sx={{ minWidth: 300, maxWidth: matches ? "calc(100% - 80px)" : "100%", margin: "auto" }} component={Paper}>
                    <Table stickyHeader aria-label="Active licences table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Rank</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center" style={{ color: theme.palette.primary.main }}>
                                    Score
                                </TableCell>
                                <TableCell align="center" style={{ color: theme.palette.red.main }}>
                                    Red
                                </TableCell>
                                <TableCell align="center" style={{ color: theme.palette.yellow.main }}>
                                    Yellow
                                </TableCell>
                                <TableCell align="center" style={{ color: theme.palette.green.main }}>
                                    Green
                                </TableCell>
                                <TableCell align="center" style={{ color: theme.palette.blue.main }}>
                                    Blue
                                </TableCell>
                                <TableCell align="center" style={{ color: theme.palette.orange.main }}>
                                    Orange
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scoreLists.length > 0 ? (
                                scoreLists.map((value, index, array) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell align="center">{value.name}</TableCell>
                                        <TableCell align="center">{value.score}</TableCell>
                                        <TableCell align="center">{value.r}</TableCell>
                                        <TableCell align="center">{value.y}</TableCell>
                                        <TableCell align="center">{value.g}</TableCell>
                                        <TableCell align="center">{value.b}</TableCell>
                                        <TableCell align="center">{value.o}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <h3>No Players Submitted .</h3>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination component="div" count={playerCount} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} />
                </TableContainer>
            </div>
        </div>
    )
}