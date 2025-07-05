import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import ExpandMoreIcon from "@mui/icons-material/ExpandMoreOutlined"
import Grid from "@mui/material/Grid"
import { useState } from "react"




const ViewJournalBox = () => {

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            ml: 1,
            gap: 1
        }}>
            <Typography variant="h5" fontFamily="monospace" ml={1}>
                View/Search Journal
            </Typography>

            <SearchJournalAccordion />

        </Box>
    )
}

const SearchJournalAccordion = () => {

    // List of the journal entries 
    const [list_of_journal_entries, setListofJournalEntries] = useState([
        [
            
        ]
    ])

    // Search parameters on the list 

    return (
        <Box>
            <Accordion>

                <AccordionSummary sx={{
                    backgroundColor: "#ebcf34"
                }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography component="span" fontFamily="monospace">
                        Expand the Search Tab for Journal
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>

                    <Grid container direction = "row">

                        <Grid item size = {4}>



                        </Grid>

                        <Grid item size = {8}>

                        </Grid>

                    </Grid>

                </AccordionDetails>
            </Accordion>
        </Box>
    )
}
export default ViewJournalBox