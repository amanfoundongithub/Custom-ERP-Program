from pydantic import BaseModel, EmailStr, Field 
from typing   import Optional
from datetime import datetime 
from bson     import ObjectId


# ID model
class PyObjectID(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate 
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v): 
            raise ValueError("Invalid Object")
        return ObjectId(v)

# Pydantic user model
class UserDB(BaseModel):
    id : Optional[PyObjectID] = Field(alias = "_id")
    email: EmailStr
    phone: str
    password: str  
    legal_name: str
    dob: datetime
    gender: str
    nationality: str
    
    class Config: 
        json_encoders = {
            ObjectId : str 
        }
        arbitary_types_allowed = True 
        