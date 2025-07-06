
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from api.models.requests import * 
from utils.jwt import *

router = APIRouter(
    prefix = "/session",
    tags = ["session"]
)


@router.get("/start") 
async def start_my_session():
    """ 
    Custom route to define the starting of a session, takes in the data to start the session
    & throws custom error whenever applicable 
    
    Status Codes 
    ---
    *201* : Successful Token & Cookie Created
    *502* : Error in creating the token 
    """
    try:
        # Convert the data to dictionary 
        data_encrypt = {
            "iat" : datetime.now().timestamp(),
            "session" : True,
        }
        
        # Create a signed token
        token = generate_jwt_token(data_encrypt, minutes_to_expire = None)
        
        print(token)
        
        # Create a HTTP response
        response = JSONResponse(
            status_code = 201, 
            content = {
                "message" : "Successful"
            }
        )
        
        # Set a cookie 
        response.set_cookie(
            key = COOKIE_NAME, 
            value = token, 
            httponly = True, 
            samesite = "lax",
            max_age = 60 * ACCESS_TOKEN_EXPIRE_MINUTES
        )
        
        return response 
    
    except (JWTError, JOSEError, TypeError) as e:

        # Error : 502 if unable to get the token 
        response = JSONResponse(
            status_code = 502,
            content = {
                "message" : "Unexpected error due to rendering of token"
            }
        )
        
        return response 
        