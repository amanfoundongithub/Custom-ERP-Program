import React from "react";
import TopBar from "../utils/TopBar";
import Box from "@mui/material/Box";
import WelcomeBox from "./WelcomeBox";


const MainHomePage = () => {

    return(
        <div>
            <TopBar />
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