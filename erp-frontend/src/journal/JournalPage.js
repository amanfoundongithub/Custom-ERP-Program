import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"
import React, { useEffect, useState } from "react"
import WhatIsAJournalBox from "./JournalInfoBox"
import AddTransactionBox from "./AddTransactionBox"
import ViewJournalBox from "./ViewJournalBox"
import { useNavigate } from "react-router-dom"

const JournalPage = () => {

    // Loader spinner to load the page, controller for controlling the behavior
    const [pageLoaded, setPageLoader] = useState(false)

    // Get list of all the accounts if possible
    const [listofaccnames, setListofAccNames] = useState([
        "Cash", "Purchases", "Sales", "Retained Earnings"
    ])

    const navigateTo = useNavigate() 

    // Function to connect to server, takes the access token
    const attemptConnection = () => {
        fetch("http://localhost:8000/session/start", {
            method : "GET",
            credentials : "include",
        })
        .then((res) => {
            if(res.status == 201) {
                // If my connection is deemed successful, I want to ensure that the token works
                verifyUserToken() 
            } else {
                setPageLoader(false) 
                alert("ERROR : Connection to Server failed")
            }
        })
        .catch((err)=> {
            console.log(err) 
        })
    }

    const verifyUserToken = () => {
        const password = prompt("Server is live now, you need to enter passcode for the company:")
        if(password === null) {
            alert("ERROR: Unauthorized access without passcode not allowed")
            navigateTo("/auth/signin")
        }

        fetch("http://localhost:8000/user/token/verify", {
            method : "GET",
            credentials : "include"
        }) 
        .then((res) => {
            if(res.status == 200) {
                setTimeout(() => {
                    setPageLoader(true)
                }, 3000) 
            } else {
                alert("ERROR : You are either not logged in or your session has expired!")
                navigateTo("/auth/signup")
            }
        })
    }

    // Loading the page 
    useEffect(() => {
        // 
        attemptConnection() 
    }, [])

    // List of transactions i want to show? 
    return (
        pageLoaded == false ?
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt : 4
            }} gap={1}>

                
                    <CircularProgress />
                    <Typography variant="subtitle1">
                        Please wait while we load the journal page...
                    </Typography>
          


            </Box>
            :
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }} gap={1}>

                <Typography variant="h4" textAlign="center" mt={1}>
                    Welcome to the Journal Portal!
                </Typography>


                <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    {/**
                     * This is the box that is used to show the details 
                     */}
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        textAlign : "start",
                    }}>
                        
                        <WhatIsAJournalBox />

                        <AddTransactionBox listofaccnames = {listofaccnames} setListofAccNames = {setListofAccNames}/>

                        <ViewJournalBox />

                    </Box>

                </Box>
            </Box>

    )
}

export default JournalPage

