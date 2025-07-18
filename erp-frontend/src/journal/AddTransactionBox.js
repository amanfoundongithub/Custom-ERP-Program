import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskIcon from '@mui/icons-material/AddTask';
import WarningIcon from '@mui/icons-material/Warning';

import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Autocomplete from "@mui/material/Autocomplete";



const AddTransactionBox = (props) => {

    let listofaccnames = props.listofaccnames
    let setListofAccNames = props.setListofAccNames

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            ml: 1,
            gap: 1
        }}>
            <Typography variant="h5" fontFamily="monospace" ml={1}>
                Add A Transaction
            </Typography>

            <AddTransactionButton listofaccnames={listofaccnames} setListofAccNames={setListofAccNames} />

        </Box>
    )
}


const findTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    return dateString;
}


const isValid = (list_of_accounts) => {

    const debits = list_of_accounts.filter(a => a.typeofAcc === "Debit");
    const credits = list_of_accounts.filter(a => a.typeofAcc === "Credit");

    // Sum of solutions 
    const sumofDebits = debits.reduce((sum, e) => sum = sum + e.amount, 0)
    const sumofCredits = credits.reduce((sum, e) => sum = sum + e.amount, 0)

    // Valid?
    const notEqual = (sumofCredits === sumofDebits)
    const noCredit = (sumofCredits != 0)
    const noDebit = (sumofDebits != 0)

    return notEqual && noCredit && noDebit
}


const AddTransactionButton = (props) => {

    /**
     * Access parameters from the previous parent page
     */
    let setListofAccNames = props.setListofAccNames
    let listofaccnames = props.listofaccnames


    /**
     * Utility to fetch company name from URL 
     */
    const [params] = useSearchParams() 
    const fetchCompanyFromURL = () => {
        const company = params.get("company")
        if (company === null || company.trim() === "") {
            throw Error("INVALID_COMPANY")
        } else {
            return company
        }
    }

    /**
     * Meta-data of transaction: date & description of transaction
     * 
     * transactionDate => date of the transaction 
     * description     => description of the transaction
     */
    const [transactionDate, setDateofTransaction] = useState(findTodayDate())
    const [description, setDescription] = useState("This is a transaction")

    /**
     * Main data: 
     * 
     * List of debits & credits 
     * 
     * list_of_accounts => Accounts list we will consider for sending to the backend
     */
    const [list_of_accounts, modifyList] = useState([])

    /**
     * Editing helpers for live preview of edits
     * 
     * edit_list => account list that will be displayed to the user as a preview
     * edit_account => edit access is enabled for the entry or not ? 
     */
    const [edit_list, modifyEditList] = useState([])
    const [edit_account, setEditAccess] = useState([])

    /**
     * Helper utility functions for update of the tables 
     * 
     * Edit Access (allow/disable)
     */

    const allowEditAccess = (idx) => {
        setEditAccess(access => {
            let updated = [...access] 
            updated[idx] = true 
            return updated 
        })
    }

    const disableEditAccess = (idx) => {
        setEditAccess(access => {
            let updated = [...access]
            updated[idx] = false
            return updated;
        })
    }

    /**
     * Helper utility functions for the table entries
     */
    
    const addEntry = () => {
        // New account
        const new_dummy = {
            "account": "",
            "typeofAcc": "Debit",
            "amount": 0.0,
        }

        // Add this to the list 
        modifyList([...list_of_accounts, new_dummy])

        // Add to the list
        modifyEditList([...edit_list, new_dummy])

        // Add access modifier to true
        setEditAccess([...edit_account, true])
    }

    const editEntry = (idx, field, value) => {
        modifyEditList(list => {
            let updated = [...list]
            updated[idx] = {
                ...updated[idx],
                [field]: value,
            }
            return updated
        })
    }

    const removeEntry = (idx) => {

        modifyList(list => {
            let updated = [...list]
            updated.splice(idx, 1)
            return updated;
        })

        modifyEditList(list => {
            let updated = [...list]
            updated.splice(idx, 1)
            return updated;
        })

        // Now remove access
        setEditAccess(access => {
            let updated = [...access]
            updated.splice(idx, 1)
            return updated;
        })
    }

    const saveChanges = (idx) => {
        modifyList(list => {
            let updated = [...list]
            updated[idx] = edit_list[idx]
            return updated
        })
        disableEditAccess(idx)
    }


    const navigate = useNavigate()

    /**
     * Part 2: Confirmation of Transaction
     */
    const [confirmation, setConfirmation] = useState(false)

    const [confirmSubmission, setConfirmSubmission] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [success, setSuccess] = useState(null)

    const actiononConfirmation = () => {
        setConfirmSubmission(false)
        setProcessing(true)

        const debits = list_of_accounts.filter(a => a.typeofAcc === "Debit")
        const credits = list_of_accounts.filter(a => a.typeofAcc === "Credit")

        // Request writer
        fetch("http://localhost:8000/journal/add?company=" + params.get("company"), {
            "method" : "POST",
            "credentials" : "include",
            "headers" : {
                "Content-Type" : "application/json"
            },
            "body" : JSON.stringify(
                {
                    dateOfEntry : transactionDate,
                    description : description,
                    debit : debits,
                    credit : credits 
                }
            )
        })

        .then((res) => {
            if(res.status == 201) {
                setTimeout(() => {
                    setProcessing(false)
                    setSuccess(true)
                }, 5000)
            } else {
                res.json().then((val) => console.log(val))
            }
        }) 
        .catch((err) => {
            console.log(err) 
        })
        
        
    }

    return (
        <Box>

            <Modal open={confirmSubmission} onClose={() => setConfirmSubmission(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper', p: 4, boxShadow: 24,
                    borderRadius: 2, width: 400,
                    display: 'flex', flexDirection: 'column', gap: 2,
                }}>
                    <Typography variant="h5">
                        Confirm The Transaction
                    </Typography>
                    <Typography variant="subtitle1">
                        Are you sure you want to post this transaction?
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                    }}>
                        <WarningIcon sx={{ mt: 1, mr: 1 }} color="warning" />
                        <Typography variant="button" color="error">
                            Note : You will NOT be allowed to make
                            changes once the transaction is submitted!
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="contained" color="secondary" onClick={() => setConfirmSubmission(false)}>
                            No
                        </Button>
                        <Button variant="outlined" color="success" onClick={actiononConfirmation}>
                            Yes
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal open={processing}>
                <Box sx={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    bgcolor: 'rgba(0, 0, 0, 0.9)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 24, flexDirection: 'column', gap: 2
                }}>
                    <Typography fontFamily="monospace" variant="h4">
                        Please wait while the transaction is being added to the journal...
                        Do not close or exit the window...
                    </Typography>
                </Box>
            </Modal>

            <Modal open={success !== null} onClose={() => {
                setSuccess(null);
            }}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper', p: 4, boxShadow: 24,
                    borderRadius: 2, width: 400
                }}>
                    <Typography variant="h5" fontFamily="monospace">
                        Message From Server
                    </Typography>

                    <Typography variant="body2" color={success ? "success" : "error"} fontFamily="monospace">
                        {success ?
                            "The transaction has been added successfully to the journal!" :
                            "The transaction could not be added to the journal!"}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: "row-reverse",
                    }}>

                        <Button sx={{ mt: 2 }} onClick={() => {
                            setSuccess(null)
                        }}>
                            Go Back To Journals
                        </Button>

                        <Button sx={{ mt: 2 }} onClick={() => {
                            setSuccess(null);
                            navigate("/home");
                        }}>Go Back To Home
                        </Button>

                    </Box>

                </Box>
            </Modal>

            <Accordion>
                <AccordionSummary sx={{
                    backgroundColor: "#f59e42"
                }} 
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography component="span" fontFamily="monospace">
                        <strong>Step I :</strong>
                        Add Details of Transaction
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>

                    <Grid container direction="row">

                        <Grid item size={6}>
                            <Typography variant="button">
                                For the transaction, enter the date & the description of the transaction:
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                mt: 2
                            }}>

                                <TextField label="Date of Transaction" type="date"
                                    value={transactionDate}
                                    onChange={(e) => {
                                        setDateofTransaction(e.target.value)
                                    }} />

                                <TextField label="Description of Transaction" type="text"
                                    fullWidth
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value)
                                    }} />

                            </Box>

                            <Typography variant="button">
                                Enter the account(s) debited/credited in the table below:
                            </Typography>

                            <TableContainer component={Paper} sx={{
                                mt: 2
                            }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow sx={{
                                            fontWeight: "bold"
                                        }}>
                                            <TableCell sx={{ fontWeight: "bold" }}>Account(s) Name</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                                Type (Debit/Credit)
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                                Amount (in $)
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                                Edit
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                                Delete
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {list_of_accounts.map((row, idx) => {
                                            // Check edit access or not
                                            const access = edit_account[idx]

                                            return (
                                                access == false ?
                                                    <TableRow
                                                        key={row.account}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.account}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.typeofAcc}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.amount}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                onClick={() => allowEditAccess(idx)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                onClick={() => removeEntry(idx)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                    :
                                                    <TableRow
                                                        key={row.account}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            <Autocomplete
                                                                freeSolo
                                                                options = {listofaccnames}
                                                                value = {edit_list[idx]?.account || ""}
                                                                onChange = {(event, newValue) => {
                                                                    editEntry(idx, "account", newValue || "");
                                                                }}
                                                                onInputChange = {(event, newInputValue) => {
                                                                    editEntry(idx, "account", newInputValue);
                                                                }}
                                                                renderInput = {(params) => (
                                                                    <TextField {...params} label="Account Name" variant="outlined" />
                                                                )}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Select defaultValue={row.typeofAcc}
                                                                onChange={(e) => {

                                                                    editEntry(idx, "typeofAcc", e.target.value)
                                                                }}
                                                            >
                                                                <MenuItem value={"Debit"}>Debit</MenuItem>
                                                                <MenuItem value={"Credit"}>Credit</MenuItem>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <TextField defaultValue={row.amount} type="number"
                                                                onChange={(e) => {
                                                                    editEntry(idx, "amount", parseFloat(e.target.value))
                                                                }} />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                onClick={() => saveChanges(idx)}>
                                                                <SaveIcon />
                                                            </IconButton>

                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                onClick={() => removeEntry(idx)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>

                                            )

                                        })}

                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                <Button fullWidth
                                                    onClick={addEntry}>
                                                    <Typography variant="subtitle1" textAlign="center">
                                                        + Add New Row
                                                    </Typography>
                                                </Button>
                                            </TableCell>



                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        <Grid item size={6}>
                            <LivePreviewPanel
                                transactionDate={transactionDate}
                                description={description}
                                list_of_accounts={edit_list} />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary sx={{
                    backgroundColor: "#45f542"
                }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography component="span" fontFamily="monospace">
                        <strong>Step II:</strong>
                        Confirm Transaction
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>

                    <Grid container direction="row">

                        <Grid item size={6}>

                            <Typography variant="subtitle1">
                                As a part of the review, review your
                                journal entry (from the preview given on the right side) and check for any
                            </Typography>

                            <List>

                                <ListItem>
                                    <ListItemIcon>
                                        <AddTaskIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Missing Values" />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <AddTaskIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Incorrect Values" />
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <AddTaskIcon />
                                    </ListItemIcon>
                                    <ListItemText primary=
                                        "Equality of credit & debit, as a part of the double entry accounting standards (Refer to the message above the table)" />
                                </ListItem>
                            </List>

                            <Typography variant="subtitle1" mb={1}>
                                If any of these is true, you can go back to Step I and edit the transaction
                                details. The updated details will be reflected in the preview as well.
                            </Typography>

                            <Box sx={{
                                display: 'flex'
                            }}>
                                <Checkbox onClick={() => {
                                    setConfirmation(!confirmation)
                                }} />

                                <Typography>
                                    I hereby confirm that all the details of this transaction are complete, accurate, and true to the best of my knowledge. I affirm that I am the author of this transaction and accept full responsibility for its content and submission.
                                </Typography>
                            </Box>

                        </Grid>

                        <Grid item size={6}>
                            <LivePreviewPanel
                                transactionDate={transactionDate}
                                description={description}
                                list_of_accounts={list_of_accounts} />

                            <Box sx={{
                                display: 'flex',
                                alignContent: 'center',
                                justifyContent: 'center',
                                gap: 2
                            }}>

                                <Button variant="outlined" sx={{
                                    fontFamily: 'sans-serif'
                                }} color="success"
                                    disabled={!confirmation || isValid(edit_list) == false}
                                    onClick={() => {
                                        setConfirmSubmission(true)
                                    }}
                                >
                                    Confirm Transaction
                                </Button>

                                <Button variant="outlined" sx={{
                                    fontFamily: 'sans-serif'
                                }} color="error">
                                    Abort Changes
                                </Button>

                            </Box>
                        </Grid>
                    </Grid>

                </AccordionDetails>
            </Accordion>

        </Box>
    )
}

const LivePreviewPanel = (props) => {

    const transactionDate = props.transactionDate
    const description = props.description
    const list_of_accounts = props.list_of_accounts

    const debits = list_of_accounts.filter(a => a.typeofAcc === "Debit");
    const credits = list_of_accounts.filter(a => a.typeofAcc === "Credit");


    // Combine entries in order: debits first, then credits
    const orderedEntries = [...debits, ...credits];

    // Sum of solutions 
    const sumofDebits = debits.reduce((sum, e) => sum = sum + e.amount, 0)
    const sumofCredits = credits.reduce((sum, e) => sum = sum + e.amount, 0)

    // Valid?
    const notEqual = (sumofCredits !== sumofDebits)
    const noCredit = (sumofCredits == 0)
    const noDebit = (sumofDebits == 0)

    return (
        <Box sx={{ p: 4 }}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 700 }}>
                <Typography variant="h6" gutterBottom>
                    Preview of Journal Entry
                </Typography>

                <Box sx={{
                    mt: 1
                }}>
                    {

                        noCredit ?
                            <Alert severity="error">
                                Journal entry is invalid, as there is no Credit
                            </Alert>
                            :
                            noDebit ?
                                <Alert severity="error">
                                    Journal entry is invalid, as there is no Debit
                                </Alert>
                                :
                                notEqual ?
                                    <Alert severity="error">
                                        Journal entry is invalid, as Credit = {sumofCredits} & Debit = {sumofDebits}
                                    </Alert>
                                    :
                                    <Alert severity="success">
                                        Journal entry is valid, credit equals debit
                                    </Alert>

                    }
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '120px' }}><strong>Date</strong></TableCell>
                            <TableCell><strong>Particulars</strong></TableCell>
                            <TableCell align="right"><strong>Debit</strong></TableCell>
                            <TableCell align="right"><strong>Credit</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {orderedEntries.map((entry, idx) => (
                            <TableRow key={idx}>
                                <TableCell>
                                    {idx === 0 ? transactionDate : ''}
                                </TableCell>
                                <TableCell sx={{ pl: entry.typeofAcc === "Credit" ? 4 : 0 }}>
                                    {entry.typeofAcc === "Debit"
                                        ? `${entry.account} A/c Dr.`
                                        : `To ${entry.account} A/c`}
                                </TableCell>
                                <TableCell align="right">
                                    {entry.typeofAcc === "Debit" ? entry.amount.toFixed(2) : ''}
                                </TableCell>
                                <TableCell align="right">
                                    {entry.typeofAcc === "Credit" ? entry.amount.toFixed(2) : ''}
                                </TableCell>
                            </TableRow>
                        ))}

                        {/* Narration */}
                        <TableRow>
                            <TableCell />
                            <TableCell colSpan={3}>
                                <Typography sx={{ fontStyle: 'italic', pl: 2 }}>
                                    ({description})
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}



export default AddTransactionBox