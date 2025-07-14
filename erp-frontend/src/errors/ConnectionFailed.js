import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"


const ConnectionFailedPage = (props) => {

    const retry_callback = props.callback

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
                    SERVER CONNECTION ERROR:
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    We are currently unable to get the token for current session.
                    Either the server is busy or we are unable to connect to it.
                    Please try again after some time.
                </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                    variant="outlined"
                    color="warning"
                    onClick={retry_callback}>
                    Retry Connection
                </Button>
            </Box>
            
        </Box>
    )
}

export default ConnectionFailedPage