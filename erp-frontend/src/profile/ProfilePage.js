import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"



const ProfilePage = () => {

    // URL params 
    const [params] = useSearchParams() 

    // Method to get email from the params
    const getEmailFromParams = () => {
        const email = params.get("email")
        
        if(email === null || email.trim() === "") {
            alert("ERROR : Invalid URL, missing `email`")
        } else {
            getSessionToken(email) 
        }
    }

    // Method to get session token from the server 
    const getSessionToken = (email) => {

        fetch("http://localhost:8000/session/start", {
            method : "GET",
            credentials : "include"
        })
        .then((res) => {
            if(res.status == 201) {
                getEmailDetails(email) 
            } else {
                alert("ERROR : Server is unable to issue token at this moment; please try again!") 
            }
        })
        .catch((err) => {
            console.log(err) 
        })
    }

    // Method to get the details of the email from server
    const getEmailDetails = (email) => {

        fetch("http://localhost:8000/user/details?email=" + email, {
            method : "GET",
            credentials : "include"
        }) 
        .then((res) => {
            if(res.status == 200) {
                res.json()
                .then((val) => {
                    console.log(val)
                    setDetails(val) 
                    setPageLoad(true) 
                })
                .catch((err) => {
                    console.log(err) 
                })
                
            } else {
                alert("ERROR : Could not fetch details of the person") 
            }
        })
    }

    // Method to get age from DOB
    const getAgeFromDOB = (dob) => {

        const DOB = new Date(dob)
        const today = new Date()

        let age = today.getFullYear() - DOB.getFullYear()
        const m = today.getMonth() - DOB.getMonth()
        const d = today.getDate() - DOB.getDate() 

        if(m < 0 || (m === 0 && d < 0)) {
            age-- 
        } return age 
    }

    /**
     * State variables 
     */
    const [details, setDetails] = useState({}) 
    

    // Should the page be loaded?
    const [pageLoad, setPageLoad] = useState(false) 
    

    // Get the email of the person if it does
    useEffect(() => {
        getEmailFromParams()
    }, []) 

    return( 
        pageLoad == false ?
        <Box sx = {{
            display : 'flex',
            justifyContent : 'center'
        }}>

            <CircularProgress />
            <Typography variant = "caption">
                Please wait while we fetch details...
            </Typography>
        </Box>
        :
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
                            {details.legal_name}
                        </Typography>

                        <Typography variant = "h6">
                            {details.nationality}, {details.gender}, {getAgeFromDOB(details.dob)} years old  
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
                            defaultValue = {details.email}
                            
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
                            defaultValue = {details.phone}
                            />
                        </Box>
                    </Box>
                    

                </Grid>

            </Grid>
        </Box>
    )
}

export default ProfilePage