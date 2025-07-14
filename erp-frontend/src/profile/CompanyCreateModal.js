import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormLabel from "@mui/material/FormLabel"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Modal from "@mui/material/Modal"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import Select from "@mui/material/Select"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import { useState } from "react"

/*

*/


const CreateCompanyModal = (props) => {

    const email = props.email 

    const [modalOpen, setModalOpen] = useState(false)
        const [companyForm, setCompanyForm] = useState({
            name: "",
            typeofCompany: "",
            ceoOrCfo: "",
            dateofFounding: "",
            passcode: ""
        })
    
        // Method to handle company creation by user 
    const handleCompanyCreation = () => {
        const payload = {
            name: companyForm.name,
            typeofCompany: companyForm.typeofCompany,
            members: [],
            CEO: companyForm.ceoOrCfo === "CEO" ? email : "",
            CFO: companyForm.ceoOrCfo === "CFO" ? email : "",
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

    return(
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

                <Button onClick={() => setModalOpen(true)} variant = "outlined">
                                                    + Create A Company
                                                </Button>
        </Box>
    )
}

export default CreateCompanyModal