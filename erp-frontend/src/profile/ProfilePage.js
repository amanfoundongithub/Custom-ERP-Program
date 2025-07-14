import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"


import ExpandMoreIcon from "@mui/icons-material/ExpandMoreOutlined"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { getAllCompaniesURLandBody, getProfileDetailsURLandBody, getSessionTokenURLandBody } from "../utils/requestHelper"

import ConnectionFailedPage from "../errors/ConnectionFailed"
import ConnectingPage from "../errors/Connecting"
import CreateCompanyModal from "./CompanyCreateModal"


// Method to get age from DOB
const getAgeFromDOB = (dob) => {

    const DOB = new Date(dob)
    const today = new Date()

    let age = today.getFullYear() - DOB.getFullYear()
    let m = today.getMonth() - DOB.getMonth()
    let d = today.getDate() - DOB.getDate()

    if (m < 0 || (m === 0 && d < 0)) {
        age--
    } return age
}

/**
 * Component of the profile page the whole page
 * 
 * URL : /profile?email=<email> & others are not allowed 
 * 
 * @author amanfoundongithub
 * 
 */
const ProfilePage = () => {

    /**
     * Control variable for controlling the page
     */
    const [pageLoad, setPageLoad] = useState(null)
    const navigator = useNavigate() 


    /**
     * Utility for fetching email from URL params 
     */
    const [params] = useSearchParams()
    const fetchEmailFromURL = () => {
        const email = params.get("email")

        if(email === null || email.trim() === "") {
            throw Error("INVALID_EMAIL")
        } else {
            return email 
        }
    }

    /**
     * State variables : details & company list 
     */
    const [details, setDetails] = useState({})
    const [companies, setCompanies] = useState([]) 

    /**
     * Utility for getting session token (Callback 1)
     */
    const getSessionToken = () => {

        try {
            // Get email from the URL
            const email = fetchEmailFromURL()

            // Set page in loader mode
            setPageLoad(null)

            // Get the body and url from the token_request_body 
            const [url, body] = getSessionTokenURLandBody()

            // API call to the backend
            fetch(url, body)

                .then(
                    (res) => {
                        if(res.status === 201) {
                            fetchEmailDetailsFromServer(email) 
                        } else {
                            setPageLoad(false) 
                        }
                    }
                )

                .catch(
                    (err) => {
                        console.log(err)
                        setPageLoad(false) 
                    }
                )

        } catch(err) {
            alert("ERROR: Invalid domain; field 'email' does not exist") 
        }
    }

    /**
     * Utility for getting email details from the server (callback 2)
     * 
     */
    const fetchEmailDetailsFromServer = (email) => {

        // Get the url and the body
        const [url, body] = getProfileDetailsURLandBody(email)

        fetch(url, body)

            .then(
                (res) => {
                    if(res.status === 200) {
                        res.json()
                            .then(
                                (details) => {
                                    setDetails(details)
                                    fetchAllCompaniesOfPersonFromServer(email)
                                }
                            )
                            .catch(
                                (err) => {
                                    console.log(err) 
                                }
                            )
                    } else if(res.status === 404) {

                    } else {
                        throw Error("SERVER_ERROR")  
                    }
                }
            )

            .catch(
                (err) => {
                    console.log(err) 
                }
            )
    }

    /**
     * Utility for getting list of all companies (callback 3 & final one)
     */
    const fetchAllCompaniesOfPersonFromServer = (email) => {

        const [url, body] = getAllCompaniesURLandBody(email)

        fetch(url, body) 

            .then(
                (res) => {
                    if(res.status === 200) {
                        res.json()
                            .then(
                                (response) => {
                                    setCompanies(response.message) 
                                    setPageLoad(true) 
                                }
                            )
                            .catch(
                                (err) => {
                                    console.log(err) 
                                }
                            )
                    } else {
                        throw Error("SERVER_ERROR")
                    }
                }
            )

            .catch(
                (err) => {
                    console.log(err) 
                }
            )
    }

    // Start the page with session token 
    useEffect(() => getSessionToken(), [])

    return (
        pageLoad === null ?
        <ConnectingPage />
        :
        pageLoad === false ?
        <ConnectionFailedPage callback = {getSessionToken}/>
        :
            
            <Box>
                
                <Grid container direction="row">

                    <Grid item size={4} display = "flex" flexDirection = "row" justifyContent = "center" alignItems = "center"
                    sx={{
                        minHeight: '30vh'
                    }}>

                        <Avatar rounded 
                        sx={{
                            height: 100,
                            width: 100
                        }}>
                            {details.legal_name[0]}
                        </Avatar>

                    </Grid>

                    <Divider />

                    <Grid item size={8}>

                        <Box mt = {4} ml = {1}>

                            <Typography variant = "h4">
                                {details.legal_name}
                            </Typography>

                            <Typography variant = "h6">
                                {details.nationality}, {details.gender}, {getAgeFromDOB(details.dob)} years old
                            </Typography>

                        </Box>

                        <Box mt = {4} ml = {1}>

                            <Typography variant="h6">
                                Correspondence:
                            </Typography>

                            <Box display = "flex" gap = {2}>

                                <Typography variant="h6">
                                    Email:
                                </Typography>

                                <TextField variant="standard" disabled
                                defaultValue={details.email}
                                />

                            </Box>

                            <Box display = "flex" gap = {2}>

                                <Typography variant="h6">
                                    Phone:
                                </Typography>

                                <TextField variant="standard" disabled
                                defaultValue={details.phone}
                                />

                            </Box>

                        </Box>

                        <Box mr = {2}>

                            <Accordion>

                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                    sx={{
                                        backgroundColor: "burlywood"
                                    }}>

                                    <Typography variant="h5">
                                        {details.legal_name}'s Companies
                                    </Typography>

                                </AccordionSummary>

                                <AccordionDetails>

                                    <Box display = "flex">

                                        {
                                            details.isLoggedIn ?
                                                <CreateCompanyModal />
                                                :
                                                <></>
                                        }

                                    </Box>

                                    <Box display =  "flex" flexDirection = "column" gap = {2}>

                                        {
                                            companies.map((e, i) => {
                                                console.log(e) 
                                                return(
                                                    
                                                        <Paper elevation = {2}>
                                                            <Box sx = {{
                                                                display : 'flex'
                                                            }}>
                                                                <Typography variant = "h6">
                                                                    {e.role} of 
                                                                </Typography>
                                                                <Typography variant = "h6" onClick = {() => navigator("/home?company=" + e.name)}>
                                                                    {e.name}
                                                                </Typography>

                                                            </Box>
                                                        </Paper>
                                                    
                                                )
                                            })
                                        }

                                    </Box>

                                </AccordionDetails>
                            </Accordion>
                        </Box>


                    </Grid>

                </Grid>
            </Box>
    )
}

export default ProfilePage