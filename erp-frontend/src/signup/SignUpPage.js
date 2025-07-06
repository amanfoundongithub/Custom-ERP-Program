import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import Paper from "@mui/material/Paper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Stepper from "@mui/material/Stepper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"



const steps = ["Email", "Password", "Verify", "Complete"];

const SignUpPage = () => {

    const activeStep = 0; // Email step

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
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    type="email"
                                    sx={{ mb: 2 }}
                                />
                                <Box display = "flex">
                                    <Checkbox />
                                    <Typography mt = {1}>
                                        By giving my email address, I agree to the terms & conditions
                                        of the 
                                    </Typography>
                                </Box>
                                <Button variant="contained" color="primary" fullWidth>
                                    Verify My Email 
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