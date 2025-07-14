import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

import { useNavigate } from "react-router-dom"

const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });

    // Get ordinal suffix for the day
    function getOrdinal(n) {
        if (n > 3 && n < 21) return 'th'; // special case for 11th–13th
        switch (n % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    const ordinalDay = `${day}${getOrdinal(day)}`;

    return `${ordinalDay} ${month}, ${year}`;
}

const CompanyCard = (props) => {

    const details = props.details
    const navigateTo = useNavigate() 

    return (
        <Paper elevation={2}
        sx = {{
            minHeight : 40,
        }}>
            <Box display = "flex" gap = {2} ml = {2} mt = {2}>

                <Typography variant = "h6" 
                sx = {{
                    cursor : "pointer"
                }}
                onClick = {() => navigateTo("/home?company=" + details.name)}>
                    {details.name} 
                </Typography>
                
                <Chip
                    label = {details.role} 
                    color = {
                        details.role === "CEO" ? "success" 
                        :
                        details.role === "CFO" ? "warning"
                        :
                        "primary"
                    }
                />

            </Box>

            <Box display = "flex" gap = {2} ml = {2} mb = {2}>

                <Typography variant = "subtitle2">
                    (Created on {formatDate(details.dateofFounding)} as a {details.typeofCompany})
                </Typography>


            </Box>
        </Paper>

    )
}

export default CompanyCard