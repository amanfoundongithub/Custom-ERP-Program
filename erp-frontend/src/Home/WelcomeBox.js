import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import React from "react"



const WelcomeBox = () => {

    return (
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