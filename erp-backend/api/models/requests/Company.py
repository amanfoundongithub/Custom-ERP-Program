from pydantic import BaseModel, EmailStr
from datetime import datetime


# Class to get user creation request 
class CompanyCreationRequest(BaseModel):
    
    # Name of company
    name : str 
    
    # Type (corporation/partnership/LLC/LLP)
    typeofCompany : str 
    
    # Members, probably a list
    members : list = []
    
    # Owner/CEO's ID
    CEO : str 
    
    # CFO's ID if any
    CFO : str 
    
    # Established date
    dateofFounding : datetime
    
    # Passcode to get the company
    passcode : str 
    