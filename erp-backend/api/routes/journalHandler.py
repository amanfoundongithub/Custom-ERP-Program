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
async def post_entry_to_journal(company : str):
    pass 
