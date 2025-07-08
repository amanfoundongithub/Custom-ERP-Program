import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"



const ProfilePage = () => {

    return(
        <Box>
            <Grid container direction = "row">

                <Grid item size = {4} sx = {{
                    display : 'flex',
                    flexDirection : 'row',
                    justifyContent : 'center',
                    alignItems : 'center',
                    minHeight : '30vh'
                }}>

                    <Avatar rounded sx = {{
                        height : 100,
                        width : 100
                    }}>
                        D
                    </Avatar>

                </Grid>
                <Divider />
                <Grid item size = {8}>
                    
                    <Box sx = {{
                        mt : 4,
                        
                    }}>
                        <Typography variant = "h4">
                            Daniel Smith 
                        </Typography>

                        <Typography variant = "h6">
                            Indian, Male, 20 years old  
                        </Typography>

                    </Box>

                    <Box sx = {{
                        mt : 4
                    }}>
                        <Typography variant = "h6">
                            Correspondence: 
                        </Typography>

                        <Box sx = {{
                            display : 'flex',
                            gap : 2
                        }}>
                            <Typography variant = "h6">
                                Email: 
                            </Typography>

                            <TextField 
                            variant = "standard"
                            disabled 
                            defaultValue = "abc@example.com"
                            
                            />
                        </Box>

                        <Box sx = {{
                            display : 'flex',
                            gap : 2
                        }}>
                            <Typography variant = "h6">
                                Phone: 
                            </Typography>

                            <TextField 
                            variant = "standard"
                            disabled 
                            defaultValue = "9013233244"
                            />
                        </Box>
                    </Box>
                    

                </Grid>

            </Grid>
        </Box>
    )
}

export default ProfilePage