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
    prefix = "/journal",
    tags = ["journal"]
)

@router.post("/add")
async def post_entry_to_journal(company : str, 
                                entry : JournalEntry,
                                token_data : dict = Depends(verify_auth_token),
                                user_token_data : dict = Depends(verify_user_token)):

    try:
        if token_data.get("valid") == False:
            return JSONResponse(
                status_code = 403,
                content = {
                    "message" : token_data.get("error", "")
                }
            )
        
        if user_token_data.get("valid") == False:
            return JSONResponse(
                status_code = 400,
                content = {
                    "message" : user_token_data.get("error", "")
                }
            )
        
        # Email
        email = user_token_data.get("email")
        
        # Search for the company
        company_details = await company_collection.find_one({
            "name" : company,
            "$or" : [
                {
                    "CEO" : email
                },
                {
                    "CFO" : email
                },
                {
                    "members" : email 
                }
            ]
        })
        
        # If no company is found
        if company_details is None:
            return JSONResponse(
                status_code  = 404,
                content = {
                    "message" : "COMPANY_NOT_FOUND_FOR_USER"
                }
            )
        
        # Otherwise get ID and create db 
        company_id = str(company_details.get("_id"))
        db, journal, ledger = create_company_db(company_id)
        
        # Now create the journal entry added with a couple of more info
        journal_entry = entry.model_dump(by_alias = True) 
        journal_entry.update({ "dateOfCreation" : datetime.today(), "addedBy" : email})
        
        # Now add this to the db and commit 
        added_journal_entry = await journal.insert_one(journal_entry)
        
        # Now send the messsage if entry is added
        return JSONResponse(
            status_code = 201,
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
        
