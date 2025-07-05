import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"

import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import CloseIcon from '@mui/icons-material/Close';

import { useState } from "react"
import IconButton from "@mui/material/IconButton"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    width: '90%',
    maxWidth: 500,
    maxHeight: '90vh',
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
};

const contentStyle = {
    overflowY: 'auto',
    paddingRight: '8px',
};

const InfoModal = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <IconButton onClick={handleOpen}>
                <InfoOutlineIcon />
            </IconButton>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="info-modal-title"
                aria-describedby="info-modal-description"
            >
                <Box sx={style}>
                    {/* Close Button */}
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>

                    <Box sx={contentStyle}>
                        <Typography id="info-modal-title" variant="h6" component="h2" gutterBottom>
                            What is a Journal in Accounting?
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 2 }}>
                            A <strong>journal</strong> is the foundational book of accounting where every financial transaction is recorded as it happens. These records are listed in the order of occurrence, providing a chronological account of business activities.
                            Each entry typically includes the <em>date</em>, <em>debit and credit accounts</em>, <em>amounts</em>, and a <em>short explanation</em> or narration of the transaction.
                        </Typography>

                        <Typography variant="h6" component="h2" gutterBottom>
                            Purpose of a Journal
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 2 }}>
                            The journal plays a key role in maintaining an organized, complete, and traceable record of all business transactions. It ensures that all entries follow the <strong>double-entry accounting system</strong>, where each transaction affects at least two accounts (debit and credit).
                        </Typography>

                        <Typography variant="h6" component="h2" gutterBottom>
                            Types of Journals
                        </Typography>

                        <Typography variant="body1">
                            Journals can be categorized based on the type of transactions they record:
                            <ul>
                                <li><strong>General Journal:</strong> Used for infrequent or non-routine transactions such as depreciation, accruals, and adjusting entries.</li>
                                <li><strong>Sales Journal:</strong> Records all credit sales of goods or services.</li>
                                <li><strong>Purchase Journal:</strong> Tracks all credit purchases of inventory or supplies.</li>
                                <li><strong>Cash Receipts Journal:</strong> Logs all incoming cash, such as payments from customers.</li>
                                <li><strong>Cash Payments Journal:</strong> Logs all cash outflows like vendor payments or rent.</li>
                            </ul>
                        </Typography>

                        <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 2 }}>
                            Example Entry
                        </Typography>

                        <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                            {`Date: July 1, 2025
  Account                 Debit     Credit
  ----------------------------------------
  Cash                   ₹10,000
      Sales Revenue                ₹10,000
  (Being goods sold for cash)`}
                        </Typography>

                        <Typography variant="body1" sx={{ mt: 2 }}>
                            This format helps in later transferring the data to the <strong>ledger</strong>, which organizes transactions by account and is used for preparing financial statements.
                        </Typography>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};


const HowToUseModal = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <IconButton onClick={handleOpen}>
                <InfoOutlineIcon />
            </IconButton>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="info-modal-title"
                aria-describedby="info-modal-description"
            >
                <Box sx={style}>
                    {/* Close Button */}
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>

                    <Box sx={contentStyle}>
                        <Typography id="info-modal-title" variant="h5" component="h2" gutterBottom>
                            📘 How To Convert a Business Transaction into a Journal Entry
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 2 }}>
                            A <strong>journal entry</strong> is the first step in recording a financial transaction in accounting. Here’s a simple step-by-step guide to help you transform real-world transactions into formal journal entries.
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                            📝 Step-by-Step Guide
                        </Typography>

                        <ol style={{ paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                            <li>
                                <strong>Identify the transaction:</strong> Understand the event. For example: "You sold goods for ₹10,000 cash."
                            </li>
                            <li>
                                <strong>Determine the accounts involved:</strong> Every transaction affects two or more accounts. In our example:
                                <ul>
                                    <li>Cash Account (Asset - increases)</li>
                                    <li>Sales Revenue Account (Income - increases)</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Classify the accounts as Debit or Credit:</strong> Use accounting rules:
                                <ul>
                                    <li><strong>Assets ↑ → Debit</strong></li>
                                    <li><strong>Income ↑ → Credit</strong></li>
                                </ul>
                            </li>
                            <li>
                                <strong>Record the date, debit, credit, and narration in Step I:</strong>
                                <Box sx={{ backgroundColor: '#f5f5f5', p: 2, mt: 1, borderRadius: 1, fontFamily: 'monospace' }}>
                                    {`Date: July 1, 2025\nCash A/c Dr.             ₹10,000\n     To Sales Revenue A/c     ₹10,000\n(Being goods sold for cash)`}
                                </Box>
                            </li>
                            <li>
                                <strong>Ensure debits equal credits:</strong> Double-check totals to maintain the double-entry system, ensuring 
                                that the credit & debit remains equal.
                                
                            </li>
                            <li>
                                <strong>Post it in your journal:</strong> Go to Step II, once you are sure all the steps are done and after 
                                confirming these, you can push these changes to the main journal.
                            </li>
                        </ol>

                        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                            Remember: A journal is your first step in the accounting cycle and helps maintain a chronological and balanced record of all financial activities.
                        </Typography>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};


const WhatIsAJournalBox = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            ml: 1,
            gap : 1
        }}>
            <Typography variant = "h5" fontFamily = "monospace" ml = {1}>
                Guides for Help
            </Typography>

            <Box sx = {{
                display : 'flex',
                flexDirection : 'row',

            }}>

                <InfoModal />

                <Typography variant="subtitle1" mt={0.75}>
                    What is a Journal?
                </Typography>

            </Box>

            <Box sx = {{
                display : 'flex',
                flexDirection : 'row',

            }}>

                <HowToUseModal />

                <Typography variant="subtitle1" mt={0.75}>
                    How Do I Add Transaction to Journal?
                </Typography>

            </Box>

        </Box>
    )
}

export default WhatIsAJournalBox