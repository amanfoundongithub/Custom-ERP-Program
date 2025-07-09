import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react";

import {useNavigate, useSearchParams} from 'react-router-dom';



const WelcomeBox = () => {

    // URL params
    const [params] = useSearchParams() 

    // Navigator hook
    const navigateTo = useNavigate()

    // Controller for the connection to the server & loading of page 
    const [connectToServer, setConnection] = useState(null) 

    // Check if company name is there or not
    const startConnection = () => {
        if(params.get("company") === null) {
            alert("ERROR: Company name not provided in URL")
        } else {
            attemptConnection() 
        }
    }

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
                setConnection(false) 
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
                    setConnection(true)
                }, 3000) 
            } else {
                alert("ERROR : You are either not logged in or your session has expired!")
                navigateTo("/auth/signup")
            }
        })
    }

    useEffect(() => {
        startConnection() 
    }, [])

    return (
        connectToServer == null ? 
        <Box sx = {{
            display : 'flex',
            alignContent : 'center',
            justifyContent : 'center',
            gap : 1,
            mt : 4
        }}> 
            <CircularProgress />
            <Typography variant = "h5" mt = {1}>
                Please wait while we connect to the server...
            </Typography>
        </Box>
        :
        connectToServer == false ?
        <Box sx = {{
            display : 'flex',
            alignContent : 'center',
            justifyContent : 'center',
            gap : 1,
            mt : 4
        }}> 
            <CircularProgress />
            <Typography variant = "h5" mt = {1}>
                It seems that there is some problem connecting to server. Please try again.
            </Typography>
        </Box>
        :
        <Box sx={{
            border: 1,
            borderColor: 'black',
        }}>
            <Paper elevation={3} sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>

                <Typography variant="overline" align="center" mt = {2}>
                    Welcome To The Enterprise Resource Planner!
                </Typography>

                <Typography variant="subtitle1" align="center" mb = {1}>
                    What do you want to do today?
                </Typography>


                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center'
                }} mb = {2}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '75%',
                        column: '75%',

                    }} gap={2}>


                        <Button variant="outlined" color="success" sx={{
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.1)'
                            }
                        }} 
                        onClick={() => {
                            navigateTo('/journal')
                        }}>
                            ADD A TRANSACTION TO JOURNAL
                        </Button>

                        <Button variant="outlined" color="success" sx={{
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.1)'
                            }
                        }}>
                            POST THE TRANSACTIONS TO LEDGER
                        </Button>

                        <Button variant="outlined" color="success" sx={{
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.1)'
                            }
                        }}>
                            GET THE BALANCE SHEET
                        </Button>
                    </Box>
                </Box>


            </Paper>
        </Box>
    )
}

export default WelcomeBox