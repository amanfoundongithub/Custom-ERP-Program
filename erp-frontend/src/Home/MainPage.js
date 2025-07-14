import Box from "@mui/material/Box";
import WelcomeBox from "./WelcomeBox";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";


import { getSessionTokenURLandBody } from "../utils/requestHelper";

import ConnectionFailedPage from "../errors/ConnectionFailed";
import ConnectingPage from "../errors/Connecting";
import AccessFailedPage from "../errors/AccessFailed";



/**
 * Page render for the home page of the ERP of the company
 * 
 * URL : "/home?company=" <company> 
 * 
 * @author amanfoundongithub
 * 
 */
const MainHomePage = () => {

    /**
     * Control variable for controlling the page
     */
    const [pageLoad, setPageLoad] = useState(null)
    const [isAccessed, setIsAccessed] = useState(true)  

    /**
     * Utility for fetching email from URL params 
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
     * Utility for getting session token (callback 1)
     */
    const getSessionToken = () => {

        try {
            // Get company from the URL
            const company = fetchCompanyFromURL() 

            // Set page in loader mode
            setPageLoad(null)

            // Get the body and url from the token_request_body 
            const [url, body] = getSessionTokenURLandBody()

            // API call to the backend
            fetch(url, body)

                .then(
                    (res) => {
                        if (res.status === 201) {
                            verifyUserBeingPartofCompany(company)
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

        } catch (err) {
            alert("ERROR: Invalid domain; field 'company' does not exist")
        }
    }

    /**
     * Utility for verification of user being in the company 
     */
    const verifyUserBeingPartofCompany = (company) => {

        const password = prompt("Server is Up Now. Please enter the passcode to access the company:")

        fetch("http://localhost:8000/company/user/confirm?company=" + company + "&password=" + password, {
            method : "GET",
            credentials : "include"
        }) 

            .then((res) => {
                if(res.status == 200) {
                    alert("Success! Access Granted.")
                    setPageLoad(true) 
                    setIsAccessed(true)  
                } else {
                    alert("Failure! Access Denied.")
                    setPageLoad(true) 
                    setIsAccessed(false)  
                }
            })

            .catch((err) => {
                console.log(err) 
                setPageLoad(false)
            })
    }

    useEffect(() => getSessionToken(), []) 


    return (
        pageLoad === null ?
        <ConnectingPage />
        :
        pageLoad === false ?
        <ConnectionFailedPage callback = {getSessionToken}/>
        :
        isAccessed === false ?
        <AccessFailedPage callback = {getSessionToken}/>
        :
        <Box>
            <Box sx={{
                width: '100%',
                height: '90vh',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
            }}>


                <Box sx={{
                    width: '50%',
                    height: '50%',
                }}>
                    <WelcomeBox />
                </Box>

            </Box>
        </Box>
    )
}

export default MainHomePage