from pydantic import BaseModel


class OTPGenerationRequest(BaseModel):
    
    # Email of the person 
    email : str 
    

class OTPVerificationRequest(BaseModel):
    
    # OTP entered
    enteredOTP : int 
    