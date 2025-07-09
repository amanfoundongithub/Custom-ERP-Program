import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"



const SignInPage = () => {

    // Navigator
    const navigator = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleEmailValidity = () => {
        return email.includes("@")
    }

    /**
         * Config: Get session token
         */
    const [loadScreen, setLoadScreen] = useState(false)

    const getSessionToken = () => {
        fetch("http://localhost:8000/session/start", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (res.status == 201) {
                    setTimeout(() => {
                        setLoadScreen(true)
                    }, 4000)
                } else {
                    alert("Error in getting session")
                }
            })
    }

    const loginSystem = () => {
        fetch("http://localhost:8000/user/verify?email=" + email + "&password=" + password, {
            method : "GET",
            credentials : "include"
        })
        .then((res) => {
            if(res.status == 200) {

                res.json().then((res) => {
                    alert("Success! Will redirect to your profile...")
                    navigator("/profile?email=" + email)
                })
                .catch((err) => {
                    console.log(err) 
                })
                
            } else if(res.status == 404) {
                alert("ERROR: Email does not exist")
            } else if(res.status == 400) {
                alert("ERROR : Invalid Password")
            } else {
                alert("ERROR: ISE")
            }

        })
        .catch((err) => {
            console.log(err) 
        })
    }

    useEffect(() => {
        getSessionToken()
    }, [])

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