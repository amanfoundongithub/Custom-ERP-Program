import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import Link from "@mui/material/Link"
import Paper from "@mui/material/Paper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Stepper from "@mui/material/Stepper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { act, use, useState } from "react"



const steps = ["Email", "Confirm Email", "Verify", "Complete"];

const SignUpPage = () => {

    const [activeStep, setActiveStep] = useState(0); // Stepper step 

    /**
     * First Step: Getting the email address 
     * 
     * Controllers : email & checkbox 
     */
    const [email, setEmail] = useState("abc@example.com")
    const [confirmEmail, setConfirmEmail] = useState(false)

    const handleEmailValidity = () => {
        return email.includes("@")
    }

    const sendOTP = () => {
        // Blah blah
        setActualOTP(123456)
    }

    /**
     * Second Step: Verification of the email by using OTP 
     * 
     * Controllers : actual OTP, input OTP 
     */
    const [actualOTP, setActualOTP] = useState(0)
    const [enteredOTP, setEnteredOTP] = useState("000000")

    const [firstBox, setFirstBox] = useState("")
    const [secondBox, setSecondBox] = useState("")
    const [thirdBox, setThirdBox] = useState("")
    const [fourthBox, setFourthBox] = useState("")
    const [fifthBox, setFifthBox] = useState("")
    const [sixthBox, setSixthBox] = useState("")

    const verifyOTP = () => {
        if(parseInt(enteredOTP, 10) == actualOTP) {
            setActiveStep(2) 
        } else {

        }
    }

    return (
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

                <Paper elevation={3} sx={{ p: 4, maxWidth : 500, borderRadius: 2 }}>

                    {/** This will be the title of the box */}
                    <Typography variant="h5" fontFamily="monospace" textAlign="center"
                        mb={1}>
                        Welcome, Let's Get You Started
                    </Typography>

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {
                        activeStep == 0
                            ?
                            <Box>
                                <Typography variant="h6" gutterBottom align = "left">
                                    Welcome aboard!
                                </Typography>
                                <Typography variant = "subtitle2" gutterBottom>
                                    The first step of your journey begins with... your email 
                                    address. Enter your email address that will be used for
                                    system for correspondence. 
                                </Typography>
                                <TextField
                                    label = "Your Email ID"
                                    variant = "outlined"
                                    fullWidth
                                    type = "email"
                                    value = {email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error = {
                                        handleEmailValidity() == false
                                    }
                                    helperText = {
                                        handleEmailValidity() ? "" : "Enter the correct email"
                                    }
                                    sx = {{ 
                                        mb: 2 
                                    }}
                                />
                                <Box display = "flex" mb = {2}>
                                    <Checkbox onClick={() => setConfirmEmail(!confirmEmail)}/>
                                    <Typography mt = {1}>
                                        I confirm the above as my email address for correspondence
                                    </Typography>
                                </Box>
                                <Button 
                                variant="contained" 
                                color = "warning"
                                disabled = {
                                    handleEmailValidity() == false || confirmEmail == false
                                }  
                                fullWidth
                                sx = {{
                                    fontFamily : "monospace"
                                }}
                                onClick={() => {
                                    sendOTP() 
                                    setActiveStep(1)
                                }}>
                                    Verify My Email 
                                </Button>
                            </Box>
                            :
                            activeStep == 1 
                            ?
                            <Box>
                                <Typography variant="h6" gutterBottom align = "left">
                                    Verify your Email!
                                </Typography>
                                
                                <Typography variant = "subtitle2" gutterBottom>
                                    A 6-digit OTP has been sent to {email}. Please check
                                    your inbox & enter the OTP below.
                                </Typography>

                                <Box sx = {{
                                    display : 'flex',
                                    gap : 2
                                }}>
                                    <TextField variant = "standard" type = "text" value = {firstBox} inputMode = "numeric"
                                    onChange={(e) => {
                                        let val = e.target.value
                                        val = parseInt(val)
                                        console.log(val)
                                        if(val >= 0 && val < 10) { 
                                            let otp = enteredOTP.split("")
                                            otp[0] = val.toString() 
                                            console.log(otp) 
                                            setEnteredOTP(otp.join("")) 
                                            console.log(enteredOTP)
                                            setFirstBox(val) 
                                        } else {
                                            setFirstBox("")
                                        }
                                    }}
                                    
                                    sx = {{
                                        input : {
                                            textAlign : 'center'
                                        }
                                    }}/>

                                    <TextField variant = "standard" type = "text" value = {secondBox} inputMode = "numeric"
                                    onChange={(e) => {
                                        let val = e.target.value
                                        val = parseInt(val)
                                        console.log(val)
                                        if(val >= 0 && val < 10) {
                                            console.log(val) 
                                            let otp = enteredOTP.split("")
                                            otp[1] = val.toString() 
                                            setEnteredOTP(otp.join("")) 
                                            console.log(otp)
                                            setSecondBox(val) 
                                        } else {
                                            setSecondBox("")
                                        }
                                    }}
                                    
                                    sx = {{
                                        input : {
                                            textAlign : 'center'
                                        }
                                    }}/>
                                    
                                    <TextField variant = "standard" type = "text" value = {thirdBox} inputMode = "numeric"
                                    onChange={(e) => {
                                        let val = e.target.value
                                        val = parseInt(val)
                                        console.log(val)
                                        if(val >= 0 && val < 10) {
                                            let otp = enteredOTP.split("")
                                            otp[2] = val.toString() 
                                            setEnteredOTP(otp.join(""))  
                                            console.log(enteredOTP)
                                            setThirdBox(val) 
                                        } else {
                                            setThirdBox("")
                                        }
                                    }}
                                    
                                    sx = {{
                                        input : {
                                            textAlign : 'center'
                                        }
                                    }}/>

                                    <TextField variant = "standard" type = "text" value = {fourthBox} inputMode = "numeric"
                                    onChange={(e) => {
                                        let val = e.target.value
                                        val = parseInt(val)
                                        console.log(val)
                                        if(val >= 0 && val < 10) {
                                            let otp = enteredOTP.split("")
                                            otp[3] = val.toString() 
                                            setEnteredOTP(otp.join("")) 
                                            console.log(enteredOTP)
                                            setFourthBox(val) 
                                        } else {
                                            setFourthBox("")
                                        }
                                    }}
                                    
                                    sx = {{
                                        input : {
                                            textAlign : 'center'
                                        }
                                    }}/>

                                    <TextField variant = "standard" type = "text" value = {fifthBox} inputMode = "numeric"
                                    onChange={(e) => {
                                        let val = e.target.value
                                        val = parseInt(val)
                                        console.log(val)
                                        if(val >= 0 && val < 10) {
                                            let otp = enteredOTP.split("")
                                            otp[4] = val.toString() 
                                            setEnteredOTP(otp.join("")) 
                                            console.log(enteredOTP)
                                            setFifthBox(val) 
                                        } else {
                                            setFifthBox("")
                                        }
                                    }}
                                    
                                    sx = {{
                                        input : {
                                            textAlign : 'center'
                                        }
                                    }}/>

                                    <TextField variant = "standard" type = "text" value = {sixthBox} inputMode = "numeric"
                                    onChange={(e) => {
                                        let val = e.target.value
                                        val = parseInt(val)
                                        console.log(val)
                                        if(val >= 0 && val < 10) {
                                            let otp = enteredOTP.split("")
                                            otp[5] = val.toString() 
                                            setEnteredOTP(otp.join("")) 
                                            console.log(enteredOTP)
                                            setSixthBox(val) 
                                        } else {
                                            setSixthBox("")
                                        }
                                    }}
                                    
                                    sx = {{
                                        input : {
                                            textAlign : 'center'
                                        }
                                    }}/>
                                </Box>

                                <Link sx = {{
                                    mt : 2
                                }}>
                                Did not get OTP? Click here to resend
                                </Link>

                                <Button variant = "outlined" color = "info" fullWidth
                                sx = {{
                                    mt : 1
                                }}
                                onClick={verifyOTP}>
                                    Verify OTP
                                </Button>
                            </Box> 
                            :
                            <Box>
                                <Typography variant="h6" gutterBottom align="center">
                                    Login
                                </Typography>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    type="email"
                                    sx={{ mb: 2 }}
                                />
                                <Button variant="contained" color="primary" fullWidth>
                                    Submit
                                </Button>
                            </Box>

                    }



                </Paper>
            </Box>

        </Box>
    )
}

export default SignUpPage