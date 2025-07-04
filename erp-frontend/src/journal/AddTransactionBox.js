import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"

import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete'

import { useState } from "react"
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




const AddTransactionBox = () => {
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

            <AddTransactionButton />


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

const AddTransactionButton = () => {

    /**
     * Accounts
     */
    const [transactionDate, setDateofTransaction] = useState(findTodayDate())
    const [description, setDescription] = useState("This is a transaction")

    // Controller for getting list of all accounts
    const [list_of_accounts, modifyList] = useState([
        {
            "account": "Purchases",
            "type": "Debit",
            "amount": 1024.0,
        }
    ])

    // Temporary list to store the edits 
    const [edit_list, modifyEditList] = useState([...list_of_accounts])

    // Controller for controlling the editing of document
    const [edit_account, setEditAccess] = useState(
        [
            false,
        ]
    )

    // Allows the index to access edit & disable edit
    const allowEditAccess = (idx) => {
        setEditAccess(access => {

            let updated = [...access]
            updated[idx] = true
            return updated;
        })
    }

    const disableEditAccess = (idx) => {
        setEditAccess(access => {

            let updated = [...access]
            updated[idx] = false
            return updated;
        })
    }

    const removeEntry = (idx) => {

        // First remove element
        modifyList(list => {
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

    const editEntry = (idx, field, value) => {
        modifyEditList(list => {
            let updated = [...edit_list]
            updated[idx] = {
                ...updated[idx],
                [field] : value,
            }
            return updated
        })
    }

    const saveChanges = (idx) => {
        modifyList(list => {
            let updated = [...list]
            updated[idx] = edit_list[idx]
            console.log(updated)
            return updated 
        })
        disableEditAccess(idx) 
    }

    // Adding a new row => means add the empty and add the edit accounts access
    const addNewRow = () => {
        // New account
        const new_dummy = {
            "account": "",
            "type": "Debit",
            "amount": 0.0
        }

        // Add this to the list 
        modifyList([...list_of_accounts, new_dummy])
        // Add access modifier to true
        setEditAccess([...edit_account, true])
    }


    return (
        <Accordion>
            <AccordionSummary sx={{
                backgroundColor: "lightgreen"
            }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <Typography component="span">Click Here to Add Details of Transaction</Typography>
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
                                                        {row.type}
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
                                                        <TextField defaultValue = {row.account}
                                                        onChange={(e) => {
                                                            editEntry(idx, "account", e.target.value) 
                                                        }} />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Select defaultValue = {row.type}
                                                        onChange={(e) => {
                                                            
                                                            editEntry(idx, "type", e.target.value) 
                                                        }}
                                                        >
                                                            <MenuItem value={"Debit"}>Debit</MenuItem>
                                                            <MenuItem value={"Credit"}>Credit</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField defaultValue = {row.amount} type="number" 
                                                        onChange={(e) => {
                                                            editEntry(idx, "amount", parseFloat(e.target.value))
                                                        }}/>
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
                                                onClick={addNewRow}>
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
                        transactionDate = {transactionDate}
                        description = {description}
                        list_of_accounts = {edit_list}/>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>


    )
}

const LivePreviewPanel = (props) => {

    const transactionDate  = props.transactionDate
    const     description  = props.description
    const list_of_accounts = props.list_of_accounts

    const debits = list_of_accounts.filter(a => a.type === "Debit");
    const credits = list_of_accounts.filter(a => a.type === "Credit");

    // Combine entries in order: debits first, then credits
    const orderedEntries = [...debits, ...credits];
    
    // Sum of solutions 
    const sumofDebits = debits.reduce((sum, e) => sum = sum + e.amount, 0)
    const sumofCredits = credits.reduce((sum, e) => sum = sum + e.amount, 0)

    // Valid?
    const isValid = (sumofCredits === sumofDebits)

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 700 }}>
        <Typography variant="h6" gutterBottom>
          Journal Entry
        </Typography>

        <Box sx= {{
            mt : 1
        }}>
            {
                isValid ? 
                <Alert severity = "success">
                    Journal entry is valid, credit equals debit
                </Alert>
                :
                <Alert severity = "error">
                    Journal entry is invalid, as Credit = {sumofCredits} & Debit = {sumofDebits}
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
                <TableCell sx={{ pl: entry.type === "Credit" ? 4 : 0 }}>
                  {entry.type === "Debit"
                    ? `${entry.account} A/c Dr.`
                    : `To ${entry.account} A/c`}
                </TableCell>
                <TableCell align="right">
                  {entry.type === "Debit" ? entry.amount.toFixed(2) : ''}
                </TableCell>
                <TableCell align="right">
                  {entry.type === "Credit" ? entry.amount.toFixed(2) : ''}
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