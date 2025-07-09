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
async def create_user_route(details : UserCreationRequest, token_data = Depends(verify_auth_token)):
    
    try: 
        # If token is not valid, tell the provider to re-generate your token
        if token_data.get("valid") == False:
            return JSONResponse(
                status_code = 403,
                content = {
                    "message" : token_data.get("error", "")
                }
            )
            
        user_dict = details.model_dump(by_alias = True)
        
        # Verify if user exists
        verification = await user_collection.find_one({
            "email" : user_dict.get("email")
        })
        
        if verification is not None:
            raise ValueError() 

        # User password is encrypted for security 
        user_dict.update({
            "password" : encrypt_password(user_dict.get("password")) 
        })
        
        # If not, create the user & send it back the created object's id as well 
        result = await user_collection.insert_one(user_dict)
        user_dict["_id"] = str(result.inserted_id)
        
        # Generate a token to ensure that the user is login
        user_login_token = {
            "iat" : datetime.now().timestamp(),
            "user" : True,
            "id" : user_dict.get("_id") 
        }
        
        user_login_token = generate_jwt_token(user_login_token, 
                                              minutes_to_expire = USER_TOKEN_EXPIRE_MINUTES)
        
        
        # Now add to the response
        response = JSONResponse(
            status_code = 201,
            content = {
                "message" : jsonable_encoder(user_dict)
            }
        )
        
        # Additional cookie to set user, should be permanent of the website 
        response.set_cookie(
            key = COOKIE_USER_ID, 
            value = user_login_token, 
            httponly = True, 
            samesite = "lax",
            max_age = 60 * ACCESS_TOKEN_EXPIRE_MINUTES)
        
        return response
    
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
        
@router.get("/verify")
async def verify_user_email_password(email : str, password : str, token_data = Depends(verify_auth_token)):
    
    try: 
        # If token is not valid, tell the provider to re-generate your token
        if token_data.get("valid") == False:
            return JSONResponse(
                status_code = 403,
                content = {
                    "message" : token_data.get("error", "")
                }
            )
    
        # Now we will check the email & password
        user_details = await user_collection.find_one({
            "email" : email
        })
        
        if user_details is None: 
            return JSONResponse(
                status_code = 404,
                content = {
                    "message" : "NO_USER_WITH_THIS_EMAIL"
                }
            )
        
        # Confirm password
        if compare_password(password, user_details.get("password")) == False:
            return JSONResponse(
                status_code = 403,
                content = {
                    "message" : "INVALID_PASSWORD"
                }
            )
        
        # Generate a token to ensure that the user is login
        user_login_token = {
            "iat" : datetime.now().timestamp(),
            "user" : True,
            "id" : str(user_details.get("_id"))
        }
        
        user_login_token = generate_jwt_token(user_login_token, 
                                              minutes_to_expire = USER_TOKEN_EXPIRE_MINUTES)
        
        # Now set cookies
        response = JSONResponse(
            status_code = 201,
            content = {
                "message" : jsonable_encoder(user_details)
            }
        )
        
        # Additional cookie to set user, should be permanent of the website 
        response.set_cookie(
            key = COOKIE_USER_ID, 
            value = user_login_token, 
            httponly = True, 
            samesite = "lax",
            max_age = 60 * ACCESS_TOKEN_EXPIRE_MINUTES)
        
        return response
    
    except Exception as e:
        return JSONResponse(
            status_code = 500,
            content = {
                "message" : str(e)
            }
        )

@router.get("/token/verify")
async def verify_user_token_route(token_data = Depends(verify_auth_token), 
                                  user_token_data = Depends(verify_user_token)):
     
    # If token is not valid, tell the provider to re-generate your token
    if token_data.get("valid") == False:
        return JSONResponse(
                status_code = 403,
                content = {
                    "message" : token_data.get("error", "")
                }
            )
        
    # Session Expired/ Log In has failed 
    if user_token_data.get("valid") == False:
        return JSONResponse(
                status_code = 400,
                content = {
                    "message" : user_token_data.get("error", "")
                }
            )
        
    return JSONResponse(
        status_code = 200,
        content = {
            "message" : jsonable_encoder(user_token_data)
        }
    )    
    

@router.get("/details") 
async def get_details_from_email(email : str, 
                                 token_data = Depends(verify_auth_token),
                                 user_token_data = Depends(verify_user_token)):
    
    try: 
        # Is logged in?
        isLoggedIn = True 
        
        # If token is not valid, tell the provider to re-generate your token
        if token_data.get("valid") == False:
            return JSONResponse(
                status_code = 403,
                content = {
                    "message" : token_data.get("error", "")
                }
            )
        
        if user_token_data.get("valid") == False: 
            isLoggedIn = False 
        
        # Now get details from backend 
        user_details_if_found = await user_collection.find_one({
            "email" : email 
        })
        
        if user_details_if_found is None: 
            raise FileNotFoundError("ERROR : No such user exists") 
        
        user_details_if_found["_id"] = str(user_details_if_found["_id"])
        
        if user_details_if_found["_id"] != user_token_data.get("id"):
            isLoggedIn = False 
        
        user_details_if_found.update({
            "isLoggedIn" : isLoggedIn
        })
        
        return JSONResponse(
            status_code = 200,
            content = jsonable_encoder(user_details_if_found)
        ) 
        
    
    except Exception as e:
        print(e) 
        return JSONResponse(
            status_code = 500,
            content = {
                "message" : str(e)
            }
        )