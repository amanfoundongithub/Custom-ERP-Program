import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getLoginURLandBody, getSessionTokenURLandBody } from "../utils/requestHelper"




const isEmailValid = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
} 

/**
 * The default Login Page for the application
 * 
 * @author amanfoundongithub
 * 
 */
const SignInPage = () => {

    // Navigator Hook for navigation 
    const navigator = useNavigate()

    /**
     * Control parameters : 
     * 
     * email : Email of the person
     * 
     * password : Password of the person's account 
     * 
     */
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    /**
     * Control parameters for other utility page controls 
     * 
     * loadScreen : Loads the screen based on its boolean value/null value
     */
    const [loadScreen, setLoadScreen] = useState(false)


    // Handler for handling email ID verification 
    const handleEmailValidity = () => isEmailValid(email) 

    // useEffect called for getting session token 
    useEffect(() => getSessionToken(), [])

    const getSessionToken = () => {

        // Get the body and url from the token_request_body 
        const [url, body] = getSessionTokenURLandBody()

        // API call to the backend 
        fetch(url, body) 

            .then(
                (res) => {
                if (res.status == 201) {
                    setTimeout(() => setLoadScreen(true), 4000)
                } else {
                    alert("Error in getting session")
                }
            }
        )

            .catch(
                (err) => {
                    console.log(err) 
                }
        )
    }


    const loginSystem = () => {

        // Create a request body & URL from the credentials
        const [url, body] = getLoginURLandBody(email, password) 

        // API call to the backend 
        fetch(url, body) 

            .then(
                (res) => {
                if(res.status == 200) {
                    res.json()
                    .then(
                        (res) => {
                            alert("Success! Will redirect to your profile...")
                            navigator("/profile?email=" + email)
                    })
                    .catch(
                        (err) => {
                           console.log(err) 
                    })
                
                } else if(res.status == 404) {
                    alert("ERROR: Email does not exist")
                } else if(res.status == 400) {
                    alert("ERROR : Invalid Password")
                } else {
                    alert("ERROR: Internal Server Error during verification")
                }

        })
            .catch(
                (err) => {
                    console.log(err) 
        })
    }

    return (
        loadScreen == false ?
            <Box sx={{
                width: '100%',
                height: '100%'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mt: 4
                }}>
                    <CircularProgress />
                    <Typography variant="h5">
                        Please wait while we connect to server...
                    </Typography>
                </Box>
            </Box>
            :
            <Box sx={{
                width: '100%',
                height: '100%'
            }}>

                <Box
                    sx={{
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                         bgcolor: "#f5f5f5",
                    }}
                >
                    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, borderRadius: 2 }}>

                        <Typography variant="h5" fontFamily="monospace" textAlign="center"
                            mb={1}>
                            Welcome Back, member!
                        </Typography>

                        <TextField
                            label="Your Email ID"
                            variant="filled"
                            fullWidth
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={
                                handleEmailValidity() == false
                            }
                            helperText={
                                handleEmailValidity() ? "" : "Enter the correct email"
                            }
                            sx={{
                                mb: 2
                            }}
                        />

                        <TextField
                            label="Enter a Password"
                            variant="filled"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            sx={{
                                mb: 1
                            }}
                        />

                        <Button variant = "outlined" color = "success" onClick={loginSystem}>
                            Login
                        </Button>

                    </Paper>
                </Box>
            </Box>
    )
}

export default SignInPage