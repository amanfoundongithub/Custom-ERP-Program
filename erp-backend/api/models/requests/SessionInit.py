from pydantic import BaseModel


# Base class to call a session initiation request, need not any body
class SessionInitRequest(BaseModel):
    pass 
    