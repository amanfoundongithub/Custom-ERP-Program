from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from api.models.requests import * 
from api.middleware      import *

from utils.jwt           import *
from utils.password      import *

from db.connection       import user_collection


router = APIRouter(
    prefix = "/user",
    tags = ["user"]
)


@router.post("/create") 
async def create_user_route(details : UserCreationRequest):
    
    try: 
        user_dict = details.model_dump(by_alias = True)
        
        # Verify if user exists
        verification = await user_collection.find_one({
            "email" : user_dict.get("email")
        })
        
        if verification:
            raise ValueError() 

        # User password is encrypted for security 
        user_dict.update({
            "password" : encrypt_password(user_dict.get("password")) 
        })
        
        # If not, create the user & send it back the created object's id as well 
        result = await user_collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        
        return JSONResponse(
            status_code = 200,
            content = {
                "message" : jsonable_encoder(user_dict)
            }
        )
    
    except ValueError as e:
        return JSONResponse(
            status_code = 450,
            content = {
                "message" : "USER_ALREADY_EXISTS"
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code = 500,
            content = {
                "message" : str(e)
            }
        )
