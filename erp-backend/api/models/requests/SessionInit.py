from pydantic import BaseModel

class SessionInitRequest(BaseModel):
    
    # Name of the organization they are working for 
    org : str 
    
    # 
    
    