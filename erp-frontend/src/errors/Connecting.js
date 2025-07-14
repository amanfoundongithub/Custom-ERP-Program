import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"


const ConnectingPage = () => {

    return (
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
    )
}

export default ConnectingPage