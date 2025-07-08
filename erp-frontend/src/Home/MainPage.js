import Box from "@mui/material/Box";
import WelcomeBox from "./WelcomeBox";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";


const MainHomePage = () => {

    /**
     * Load the page only when you have the login token
     */
    const [loadPage, setLoadPage] = useState(null)


    return(
        <div>
            <Box sx = {{
                width : '100%',
                height : '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent : 'center',
            }}>
               

                <Box sx = {{
                    width : '50%',
                    height : '50%',
                }}>
                    <WelcomeBox/>
                </Box>
                
            </Box>
        </div>
    )
}

export default MainHomePage