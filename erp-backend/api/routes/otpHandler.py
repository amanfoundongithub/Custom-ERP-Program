from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from api.models.requests import * 
from api.middleware      import *

from utils.jwt           import *
from utils.otp           import *


router = APIRouter(
    prefix = "/otp",
    tags = ["otp"]
)

otp = {
    
}


@router.post("/generate")
async def generate_otp_route(body : OTPGenerationRequest, token_data : dict = Depends(verify_auth_token)):
    """Generates OTP & send its to the person

    Status Codes
    ---
        *203* : OTP is sent to the person
        *403* : Error in request, refer to message
        *500* : ISE, refer to the message 

    Returns:
        JSONResponse in any case
    """
    try:
        # If token is not valid, tell the provider to re-generate your token
        if token_data.get("valid") == False:
            return JSONResponse(
                status_code = 403,
                content = {
                    "message" : token_data.get("error", "")
                }
            )
        
        else: 
            # If token is valid, then generate an OTP and send it to the person 
            generated_otp = generate_otp(n = 6)
            
            # Utility to send to person (Will be implemented later TODO)
            
            # Save the OTP
            otp[token_data.get("iat")] = generated_otp
            print(generated_otp) 
            
            return JSONResponse(
                status_code = 203,
                content = {
                    "message" : "OK"
                }
            )
            
    except Exception as e:
        
        return JSONResponse(
            status_code = 500,
            content = {
                "message" : str(e)
            } 
        )

@router.post("/verify")
async def verify_otp_route(body : OTPVerificationRequest, token_data : dict = Depends(verify_auth_token)):
    """Route to verify OTP of the person

    Status Codes
    ---
        500 : ISE
        204 : OTP Validation done
        403 : Authorization Issue

    
    """
    try:
        # If token is not valid, tell the provider to re-generate your token
        if token_data.get("valid") == False:
            return JSONResponse(
                status_code = 403,
                content = {
                    "message" : token_data.get("error", "")
                }
            )
        
        else: 
            # If token is valid, get the OTP
            candidate_otp = body.enteredOTP
            
            # Verify the OTP
            if otp[token_data.get("iat")] == candidate_otp:
                return JSONResponse(
                    status_code = 201, 
                    content = {
                        "verified" : True 
                    }
                )
            else: 
                return JSONResponse(
                    status_code = 201,
                    content = {
                        "verified" : False 
                    }
                )
            
    except Exception as e:
        
        return JSONResponse(
            status_code = 500,
            content = {
                "message" : str(e)
            } 
        )

