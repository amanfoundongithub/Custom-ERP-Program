import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Link from "@mui/material/Link"
import LinearProgress from "@mui/material/LinearProgress"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { getLoginURLandBody, getSessionTokenURLandBody } from "../utils/requestHelper"
import ConnectionFailedPage from "../errors/ConnectionFailed"






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
    const [loadScreen, setLoadScreen] = useState(null)
    const [disableButton, setDisableButton] = useState(false) 


    // Handler for handling email ID verification 
    const handleEmailValidity = () => isEmailValid(email) 

    // useEffect called for getting session token 
    useEffect(() => getSessionToken(), [])

    const getSessionToken = () => {

        // Set screen in rendering mode
        setLoadScreen(null)

        // Get the body and url from the token_request_body 
        const [url, body] = getSessionTokenURLandBody()

        // API call to the backend 
        fetch(url, body) 

            .then(
                (res) => {
                if (res.status == 201) {
                    setTimeout(() => setLoadScreen(true), 4000)
                } else {
                    setLoadScreen(false) 
                }
            }
        )

            .catch(
                (err) => {
                    setLoadScreen(false) 
                    console.log(err) 
                }
        )
    }


    const loginSystem = () => {

        setDisableButton(true) 

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
                    setDisableButton(false)
                } else if(res.status == 400) {
                    alert("ERROR : Invalid Password")
                    setDisableButton(false)
                } else {
                    alert("ERROR: Internal Server Error during verification")
                    setDisableButton(false) 
                }

        })
            .catch(
                (err) => {
                    console.log(err) 
                    setDisableButton(false) 
        })
    }

    return (
        loadScreen === null ?
        <Box
                sx={{
                    width: "100%",
                    height: "90vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "#fafafa",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CircularProgress />
                    <Typography variant="h6" color="text.secondary">
                        Please wait while we are connecting to the server...
                    </Typography>
                </Box>
            </Box>
        :
        loadScreen === false ?
            <ConnectionFailedPage callback = {getSessionToken} />
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
                    <Paper elevation={3} sx={{ p: 4, maxWidth: 750, borderRadius: 2 }}>
                        {
                            disableButton == true ? 
                            <LinearProgress color = "success" sx = {{ marginTop : -4, width : '100%'}}/>
                            :
                            <></>

                        }

                        <Typography variant="h5" fontFamily="monospace" textAlign="center"
                            mb={3}>
                            Welcome Back, Dear!
                        </Typography>

                        <Typography variant = "h6" fontFamily = "monospace" textAlign = "start">
                            Enter Your Email & Password Below:
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
                                handleEmailValidity() ? "" : "Enter a valid email"
                            }
                            disabled = {
                                disableButton == true 
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
                            disabled = {
                                disableButton == true 
                            }
                            sx={{
                                mb: 1
                            }}
                        />
                        
                        <Box sx = {{
                            display : 'flex',
                            flexDirection : "row-reverse",
                            mb : 2
                        }}>
                            
                            <Link href = "/auth/signup" underline = "hover">
                                Don't have an account? Click here to create one now!
                            </Link>

                        </Box>
                        
                        

                        <Button 
                        variant = "outlined" 
                        color = "success" 
                        onClick={loginSystem} 
                        fullWidth 
                        disabled = {disableButton}>
                            Login
                        </Button>

                    </Paper>
                </Box>
            </Box>
    )
}

export default SignInPage