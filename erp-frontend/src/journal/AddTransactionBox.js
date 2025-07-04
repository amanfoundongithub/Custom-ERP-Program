import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"

import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import CloseIcon from '@mui/icons-material/Close';

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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];


const findTodayDate = () => {
    const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
    
  return dateString;
}

const AddTransactionButton = () => {
    return (
        <Accordion>
            <AccordionSummary
                //   expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <Typography component="span">Click Here to Add Transaction</Typography>
            </AccordionSummary>
            <AccordionDetails>

                {
                    /**
                     * Firstly, take the date & the description of the so-called transaction
                     */
                }

                <Typography>
                    Enter the account(s) debited/credited in the table below:
                </Typography>

                <Box sx = {{
                    display : 'flex',
                    gap : 2
                }}>
                    
                    <TextField label = "Date of Transaction" type = "date" defaultValue = {findTodayDate()}/>

                    <TextField label = "Description of Transaction" fullWidth/>
                </Box>
                
                <Typography>
                    Enter the account(s) debited/credited in the table below:
                </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Dessert (100g serving)</TableCell>
                                <TableCell align="right">Calories</TableCell>
                                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="right">{row.carbs}</TableCell>
                                    <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </AccordionDetails>
        </Accordion>
    )
}

export default AddTransactionBox