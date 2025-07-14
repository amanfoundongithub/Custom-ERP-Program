import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import RadioGroup from "@mui/material/RadioGroup"
import Radio from "@mui/material/Radio"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormLabel from "@mui/material/FormLabel"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"


import ExpandMoreIcon from "@mui/icons-material/ExpandMoreOutlined"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { getAllCompaniesURLandBody, getProfileDetailsURLandBody, getSessionTokenURLandBody } from "../utils/requestHelper"
import ConnectionFailedPage from "../errors/ConnectionFailed"
import ConnectingPage from "../errors/Connecting"



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




    // Method to get age from DOB
    const getAgeFromDOB = (dob) => {

        const DOB = new Date(dob)
        const today = new Date()

        let age = today.getFullYear() - DOB.getFullYear()
        const m = today.getMonth() - DOB.getMonth()
        const d = today.getDate() - DOB.getDate()

        if (m < 0 || (m === 0 && d < 0)) {
            age--
        } return age
    }

    // Method to handle company creation by user 
    const handleCompanyCreation = () => {
        const payload = {
            name: companyForm.name,
            typeofCompany: companyForm.typeofCompany,
            members: [],
            CEO: companyForm.ceoOrCfo === "CEO" ? details.email : "",
            CFO: companyForm.ceoOrCfo === "CFO" ? details.email : "",
            dateofFounding: companyForm.dateofFounding,
            passcode: companyForm.passcode
        }

        fetch("http://localhost:8000/company/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(payload)
        })
            .then((res) => {
                if (res.status === 201) {
                    alert("Company created successfully!")
                    setModalOpen(false)
                } else {
                    alert("Error creating company.")
                }
            })
            .catch((err) => {
                console.error(err)
            })
    }




    /**
     * State variables 
     */
    const [details, setDetails] = useState({})
    const [companies, setCompanies] = useState([]) 

    // Get the details of the company:
    const [modalOpen, setModalOpen] = useState(false)
    const [companyForm, setCompanyForm] = useState({
        name: "",
        typeofCompany: "",
        ceoOrCfo: "",
        dateofFounding: "",
        passcode: ""
    })



    // Get the email of the person if it does
    useEffect(() => {
        getSessionToken()
    }, [])

    return (
        pageLoad === null ?
        <ConnectingPage />
        :
        pageLoad === false ?
        <ConnectionFailedPage callback = {getSessionToken}/>
        :
            
            <Box>
                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        width: 400,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Create a Company
                        </Typography>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Company Name"
                            value={companyForm.name}
                            onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Type of Company</InputLabel>
                            <Select
                                value={companyForm.typeofCompany}
                                label="Type of Company"
                                onChange={(e) => setCompanyForm({ ...companyForm, typeofCompany: e.target.value })}
                            >
                                <MenuItem value="corporation">Corporation</MenuItem>
                                <MenuItem value="partnership">Partnership</MenuItem>
                                <MenuItem value="LLC">LLC</MenuItem>
                                <MenuItem value="LLP">LLP</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl margin="normal">
                            <FormLabel>Are you the</FormLabel>
                            <RadioGroup
                                row
                                value={companyForm.ceoOrCfo}
                                onChange={(e) => setCompanyForm({ ...companyForm, ceoOrCfo: e.target.value })}
                            >
                                <FormControlLabel value="CEO" control={<Radio />} label="CEO" />
                                <FormControlLabel value="CFO" control={<Radio />} label="CFO" />
                            </RadioGroup>
                        </FormControl>

                        <TextField
                            fullWidth
                            type="date"
                            margin="normal"
                            label="Date of Founding"
                            InputLabelProps={{ shrink: true }}
                            value={companyForm.dateofFounding}
                            onChange={(e) => setCompanyForm({ ...companyForm, dateofFounding: e.target.value })}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Passcode"
                            value={companyForm.passcode}
                            onChange={(e) => setCompanyForm({ ...companyForm, passcode: e.target.value })}
                        />

                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={() => handleCompanyCreation()}
                        >
                            Submit
                        </Button>
                    </Box>
                </Modal>

                <Grid container direction="row">

                    <Grid item size={4} sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '30vh'
                    }}>

                        <Avatar rounded sx={{
                            height: 100,
                            width: 100
                        }}>
                            D
                        </Avatar>

                    </Grid>
                    <Divider />
                    <Grid item size={8}>

                        <Box sx={{
                            mt: 4,
                            ml: 1
                        }}>
                            <Typography variant="h4">
                                {details.legal_name}
                            </Typography>

                            <Typography variant="h6">
                                {details.nationality}, {details.gender}, {getAgeFromDOB(details.dob)} years old
                            </Typography>

                        </Box>

                        <Box sx={{
                            mt: 4,
                            ml: 1
                        }}>
                            <Typography variant="h6">
                                Correspondence:
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                gap: 2
                            }}>
                                <Typography variant="h6">
                                    Email:
                                </Typography>

                                <TextField
                                    variant="standard"
                                    disabled
                                    defaultValue={details.email}

                                />
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                gap: 2
                            }}>
                                <Typography variant="h6">
                                    Phone:
                                </Typography>

                                <TextField
                                    variant="standard"
                                    disabled
                                    defaultValue={details.phone}
                                />
                            </Box>
                        </Box>


                        <Box sx={{
                            mr: 2,

                        }}>
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

                                    <Box sx={{
                                        display: 'flex'
                                    }}>

                                        {
                                            details.isLoggedIn ?
                                                <Button onClick={() => setModalOpen(true)}>
                                                    + Create A Company
                                                </Button>
                                                :
                                                <></>
                                        }

                                    </Box>
                                    <Box sx = {{
                                        display : 'flex',
                                        flexDirection : 'column',
                                        gap : 2
                                    }}>

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