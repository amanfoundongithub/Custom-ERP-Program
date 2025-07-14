import Alert from "@mui/material/Alert"
import Autocomplete from "@mui/material/Autocomplete"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import CircularProgress from "@mui/material/CircularProgress"
import FormControl from "@mui/material/FormControl"
import Link from "@mui/material/Link"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import Select from "@mui/material/Select"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Stepper from "@mui/material/Stepper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"


import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


const steps = ["Email", "Confirm Email", "Set A Password", "Finish Setup"];

const SignUpPage = () => {

    // Navigator
    const navigator = useNavigate()
    const [activeStep, setActiveStep] = useState(0); // Stepper step 

    /**
     * Config: Get session token
     */
    const [loadScreen, setLoadScreen] = useState(false) 

    const getSessionToken = () => {
        fetch("http://localhost:8000/session/start", {
            method : "GET",
            credentials : "include",
        }) 
        .then((res) => {
            if(res.status == 201) {
                setTimeout(() => {
                    setLoadScreen(true)
                }, 4000)
            } else {
                alert("Error in getting session")
            }
        })
    }

    useEffect(() => {
        getSessionToken()
    }, [])

    /**
     * First Step: Getting the email address 
     * 
     * Controllers : email & checkbox 
     */
    const [email, setEmail] = useState("abc@example.com")
    const [confirmEmail, setConfirmEmail] = useState(false)

    const sendOTP = () => {
        // Sends OTP to the person via backend 
        fetch("http://localhost:8000/otp/generate", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            credentials : "include",
            body : JSON.stringify({
                email : email 
            })  
        })
        .then((res) => {
            res.json().then((val) => {
                setActiveStep(1)
            }) 
        })
        .catch((err) => {
            console.log(err) 
        })
    }

    /**
     * Second Step: Verification of the email by using OTP 
     * 
     * Controllers : actual OTP, input OTP 
     */
    const [enteredOTP, setEnteredOTP] = useState("000000")

    const verifyOTP = () => {
        const OTP = parseInt(enteredOTP, 10) 

        fetch("http://localhost:8000/otp/verify", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            credentials : "include",
            body : JSON.stringify({
                enteredOTP : OTP
            })  
        })
        .then((res) => {
            if(res.status == 201) {
                res.json().then((val) => {
                    if(val.verified == true) {
                        setActiveStep(2)
                    } else {
                        alert("Incorrect OTP, try again!") 
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
            } else {
                alert("Error in verifying OTP") 
            }
        })
        .catch((err) => {
            console.log(err) 
        })
    }

    /**
     * Third Step: Creation of a Password 
     * 
     * Controllers : password, confirm password 
     */
    const [password, setPassword] = useState("")
    const [confirmPassword, setCnfPassword] = useState("")

    const isPasswordEmpty = () => {
        return password.length === 0
    }

    const arePasswordsNotEqual = () => {
        return password !== confirmPassword
    }

    const isPasswordUnacceptable = () => {
        return password.length < 8
    }

    const isPasswordStrong = () => {
        return password.length >= 8 & confirmPassword.length === 0
    }

    const isEligibleToCreateAccount = () => {
        if(isPasswordUnacceptable()){
            return false
        }
        if(arePasswordsNotEqual()){
            return false 
        }
        return true 
    }

    const createAccount = () => {
        setActiveStep(3) 
    }

    /**
     * Last Step: Take basic details of the user 
     * 
     * Controllers : Name, Gender, DOB, Nationality, Phone No
     */
    const [name, setName] = useState("")
    const [dateOfBirth, setDOB] = useState("2021-07-06")
    const [gender, setGender] = useState("Male")

    const [nationality, setNationality] = useState("Indian") 

    const nationality_options = [
        {
            label : "Indian",
            id : "Indian"
        },
        {
            label : "Australian",
            id : "Australian"
        }
    ]

    const submitDetails = () => {
        // Send post request
        fetch("http://localhost:8000/user/create", {
            method : "POST",
            credentials : "include",
            headers: {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                email: email,
                phone: String(9013233244),
                password: password,
                legal_name: name,
                dob: new Date(dateOfBirth).toISOString(),
                gender: gender,
                nationality: nationality
            })
        })
        .then((res) => {
            if(res.status == 201) {
                
                res.json().then((val)=> {
                    const message = val.message
                    navigator("/profile?email=" + message.email)
                })
                .catch((err) => {
                    console.log(err) 
                })

            } else if(res.status == 450) {
                alert("Account failed to create; Already exists one")
            }
            else {
                alert("Account failed to create; Server Issue")
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }


    return (
        loadScreen == false ?
        <Box sx={{
            width: '100%',
            height: '100%'
        }}>
            <Box sx = {{
                display : 'flex',
                justifyContent : 'center',
                gap : 2,
                mt : 4
            }}>
                <CircularProgress />
                <Typography variant = "h5">
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
                            <StepI 
                            email = {email} 
                            setEmail = {setEmail}
                            confirmEmail = {confirmEmail}
                            setConfirmEmail = {setConfirmEmail}
                            sendOTP = {sendOTP}/>
                            :
                            activeStep == 1 
                            ?
                            <StepII 
                            email = {email}
                            enteredOTP = {enteredOTP}
                            setEnteredOTP = {setEnteredOTP}
                            verifyOTP = {verifyOTP}/>
                            :
                            activeStep == 2 
                            ?
                            <Box>
                                <Typography variant="h6" gutterBottom align = "left">
                                    Set up a Password To Protect Your Account
                                </Typography>

                                <TextField 
                                label = "Enter a Password"
                                variant = "filled"
                                type = "password"
                                value = {password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                sx = {{
                                    mb : 1
                                }}
                                />

                                <TextField 
                                label = "Re-enter the Password"
                                variant = "filled"
                                value = {confirmPassword}
                                onChange={(e) => setCnfPassword(e.target.value)}
                                fullWidth
                                sx = {{
                                    mb : 2
                                }}
                                />

                                {
                                    isPasswordEmpty() ?
                                    <Alert severity = "error">
                                        Password is empty! Please enter a password!
                                    </Alert>
                                    :
                                    isPasswordUnacceptable() ?
                                    <Alert severity = "error">Password is weak! Choose a stronger & better password</Alert>
                                    :
                                    isPasswordStrong() ?
                                    <Alert severity = "success">Password looks strong! You can confirm the password!</Alert>
                                    :
                                    arePasswordsNotEqual() ?
                                    <Alert severity = "error">Passwords are not matching!</Alert>
                                    :
                                    <Alert severity = "success">Passwords are matching! Click below to create account!</Alert>
                                }

                                {
                                    isEligibleToCreateAccount() ?
                                    <Button 
                                    variant = "contained"
                                    color = "warning"
                                    fullWidth
                                    onClick={createAccount}
                                    sx = {{
                                        mt : 2
                                    }}>
                                        Create My Account
                                    </Button>
                                    :
                                    <></>
                                }


                            </Box>
                            :
                            <Box>
                                <Typography variant="h6" gutterBottom align="left">
                                    Finish Setting Up Your Profile
                                </Typography>
                                <TextField
                                    label = "Your Legal Name"
                                    variant = "outlined"
                                    type = "text"
                                    value = {name}
                                    onChange={(e) => setName(e.target.value)}  
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <Box sx = {{
                                    display: 'flex',
                                    gap : 1
                                }}>
                                    <TextField
                                    label = "Your Date of Birth"
                                    variant = "outlined"
                                    type = "date"
                                    value = {dateOfBirth}
                                    onChange={(e) => setDOB(e.target.value)}  
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />

                                <FormControl fullWidth>
                                    <Select 
                                       
                                        label = "Gender"
                                        value = {gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        
                                        sx = {{ mb : 2}}
                                    >
                                        <MenuItem value = "Male">Male</MenuItem>
                                        <MenuItem value = "Female">Female</MenuItem>
                                        <MenuItem value = "Other">Other</MenuItem>

                                    </Select>
                                </FormControl>

                                </Box>

                                <Autocomplete 
                                    disablePortal
                                    options = {nationality_options}
                                    value = {nationality}
                                    onChange={(e, newVal) => 
                                        {
                                            setNationality(newVal.label)
                                         }}
                                    getOptionLabel={(option) => option.label || ""}
                                    sx = {{mb : 2}}
                                    renderInput = {(params) => <TextField {...params} label = "Nationality" />}
                                />
                                
                                <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth
                                onClick={submitDetails}
                                >
                                    Submit Details 
                                </Button>
                            </Box>

                    }



                </Paper>
            </Box>

        </Box>
    )
}

const StepI = (props) => {

    const email = props.email 
    const setEmail = props.setEmail 

    const confirmEmail = props.confirmEmail
    const setConfirmEmail = props.setConfirmEmail

    const sendOTP = props.sendOTP

    const handleEmailValidity = () => {
        return email.includes("@")
    }


    return (
        <Box>
            <Typography variant="h6" gutterBottom align="left">
                Welcome aboard!
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
                The first step of your journey begins with... your email
                address. Enter your email address that will be used for
                system for correspondence.
            </Typography>
            <TextField
                label="Your Email ID"
                variant="outlined"
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
            <Box display="flex" mb={2}>
                <Checkbox onClick={() => setConfirmEmail(!confirmEmail)} />
                <Typography mt={1}>
                    I confirm the above as my email address for correspondence
                </Typography>
            </Box>
            <Button
                variant="contained"
                color="warning"
                disabled={
                    handleEmailValidity() == false || confirmEmail == false
                }
                fullWidth
                sx={{
                    fontFamily: "monospace"
                }}
                onClick={() => {
                    sendOTP()
                }}>
                Verify My Email
            </Button>
        </Box>
    )
}

const StepII = (props) => {

    const enteredOTP = props.enteredOTP
    const setEnteredOTP = props.setEnteredOTP

    const email = props.email 
    const verifyOTP = props.verifyOTP
    
    const [firstBox, setFirstBox] = useState("")
    const [secondBox, setSecondBox] = useState("")
    const [thirdBox, setThirdBox] = useState("")
    const [fourthBox, setFourthBox] = useState("")
    const [fifthBox, setFifthBox] = useState("")
    const [sixthBox, setSixthBox] = useState("")


    return(
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
                                        if(val >= 0 && val < 10) { 
                                            let otp = enteredOTP.split("")
                                            otp[0] = val.toString() 
                                            console.log(otp) 
                                            setEnteredOTP(otp.join("")) 
                                         
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
    )
}

export default SignUpPage