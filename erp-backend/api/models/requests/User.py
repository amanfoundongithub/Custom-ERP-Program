from pydantic import BaseModel, EmailStr
from datetime import datetime


# Class to get user creation request 
class UserCreationRequest(BaseModel):
    email: EmailStr
    phone: str
    password: str  
    legal_name: str
    dob: datetime
    gender: str
    nationality: str
    
