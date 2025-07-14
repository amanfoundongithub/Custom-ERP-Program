from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from bson                import ObjectId

from api.models.requests import * 
from api.middleware      import *

from utils.jwt           import *
from utils.password      import *

from db.connection       import * 


router = APIRouter(
    prefix = "/company",
    tags = ["company"]
)

@router.post("/create")
async def create_company_route(details : CompanyCreationRequest, 
                               token_data = Depends(verify_auth_token),
                               user_token_data = Depends(verify_user_token)):
    
    try:
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
            
        # Now create a company on behalf of the user
        company_dict = details.model_dump(by_alias = True)
        
        # Company password is encrypted for security 
        company_dict.update({
            "passcode" : encrypt_password(company_dict.get("passcode")) 
        })
        
        # Created company 
        result = await company_collection.insert_one(company_dict)
        company_dict["_id"] = str(result.inserted_id)
        
        # Now add to user's kitty
        results  = await user_collection.find_one_and_update(
            {
                "_id" : ObjectId(user_token_data.get("id"))
            },
            {
                "$addToSet": {
                    "companies": company_dict["_id"]
                }
            },
            return_document = True
        )
        
        return JSONResponse(
            status_code=201,
            content={
                "message": "Company successfully created",
                "company_id": company_dict["_id"]
            }
        )
        
    except Exception as e: 
        return JSONResponse(
            status_code = 500,
            content = {
                "message" : str(e)
            }
        )

@router.get("/all")
async def get_all_companies(email : str, 
                            token_data = Depends(verify_auth_token)):
    
    try:
        # If token is not valid, tell the provider to re-generate your token
        if token_data.get("valid") == False:
            return JSONResponse(
                status_code = 403,
                content = {
                    "message" : token_data.get("error", "")
                }
            )
            
        # Get the user's data
        user_data = await user_collection.find_one({
            "email" : email 
        })
        
        if user_data is None:
            return JSONResponse(
                status_code = 404,
                content = {
                    "message" : "USER_NOT_FOUND"
                }
            )
        
        # Companies
        companies_id = user_data.get("companies", [])
        
        company_details = []
        for i in companies_id:
            # ID details fetch
            details_of_co_id = await company_collection.find_one({
                "_id" : ObjectId(i)
            })
            # String conversion
            details_of_co_id["_id"] = str(details_of_co_id["_id"])   
            
            # Find the role 
            role = "Member"
            if email == details_of_co_id["CEO"]:
                role = "CEO"
            elif email == details_of_co_id["CFO"]:
                role = "CFO"
                
            details_of_co_id.update({
                "role" : role 
            })
            company_details.append(details_of_co_id)
               
        
        
        return JSONResponse(
            status_code = 200,
            content={
                "message": jsonable_encoder(company_details) 
            }
        )
        
    except Exception as e: 
        return JSONResponse(
            status_code = 500,
            content = {
                "message" : str(e)
            }
        )
        
@router.get("/user/confirm")
async def confirm_user(company : str, password : str, token_data = Depends(verify_auth_token), user_token_data = Depends(verify_user_token)):
    
    try: 
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
        
        # 
        email = user_token_data.get("email")
        
        # Now confirm the company first
        company_details = await company_collection.find_one(
            {
                "name" : company,
            }
        )
        
        if company_details is None:
            return JSONResponse(
                status_code = 404,
                content = {
                    "message" : "COMPANY_NOT_FOUND"
                }
            )
        

        # Check if user is part of the access 
        if company_details["CEO"] != email and company_details["CFO"] != email and email not in company_details["members"]:
            return JSONResponse(
                status_code = 403,
                content = {
                    "message" : "UNAUTHORIZED_ACCESS_TO_COMPANY" 
                }
            )
        
        # Compare the passwords
        if compare_password(password, company_details["passcode"]) == False:
            return JSONResponse(
                status_code = 401,
                content = {
                    "message" : "INVALID_PASSWORD"
                }
            )
        
        print("here")
        
        return JSONResponse(
            status_code = 200,
            content = {
                "message" : "OK"
            }
        )
    
    except Exception as e:
        print(e) 
        return JSONResponse(
            status_code = 500,
            content = {
                "message" : str(e)
            }
        )