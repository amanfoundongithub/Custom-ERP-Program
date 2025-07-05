import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"
import React, { useEffect, useState } from "react"
import WhatIsAJournalBox from "./JournalInfoBox"
import AddTransactionBox from "./AddTransactionBox"

const JournalPage = () => {

    // Loader spinner to load the page, controller for controlling the behavior
    const [pageLoaded, setPageLoader] = useState(false)

    // Loading the page 
    useEffect(() => {

        // 
        setTimeout(() => {
            setPageLoader(true)   
        }, 3000)
    })

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
                    flexDirection: 'row'
                }}>
                    {/**
                     * This is the box that is used to show the details 
                     */}
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        textAlign : "start",
                        gap : 1
                    }}>
                        
                        <WhatIsAJournalBox />

                        <AddTransactionBox />

                    </Box>

                </Box>
            </Box>

    )
}

export default JournalPage

