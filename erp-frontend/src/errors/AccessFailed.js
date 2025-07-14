import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import Typography from "@mui/material/Typography"

import { useNavigate } from "react-router-dom"

const AccessFailedPage = (props) => {

    const retry_callback = props.callback
    const navigator = useNavigate() 

    const reasons = [
        "tried to enter a wrong company, by mistake; check the URL corresponding to your company, or",
        "entered the wrong password for the company; retry the password, or",
        "are not part of this specific organization; contact the administrators for the same, or",
        "your session has expired; go to sign in page to login again"
    ]

    return (
        <Box
            sx={{
                width: "100%",
                height: "90vh",
                display: "flex",
                flexDirection: 'column',
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#fafafa",
            }}
        >
            <Box sx={{ display: "flex", gap: 2, flexDirection: 'column', maxWidth: 650 }}>
                <Typography variant="h6" color="text.error" textAlign="start">
                    ACCESS DENIED ERROR:
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    You have been denied access to the company page because you have either:
                </Typography>

                <List>
                    {
                    reasons.map((e, i) => 
                    <ListItem sx = {{
                        display : 'list-item'
                    }}>
                        <Typography color = "text.secondary">
                            {e}
                        </Typography>
                    </ListItem>)
                }
                </List>


                
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth : "20vw" }}>
                <Button
                    variant="outlined"
                    color = "secondary"
                    onClick={retry_callback}
                    fullWidth>
                    Retry
                </Button>

                <Button 
                    variant = "contained"
                    color = "warning"
                    onClick={() => navigator("/auth/signin")}
                    fullWidth>
                    
                    Sign In 
                </Button>

            </Box>
            
        </Box>
    )
}

export default AccessFailedPage