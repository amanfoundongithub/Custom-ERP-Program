from fastapi import APIRouter
from fastapi.responses import JSONResponse

from api.models.requests import * 
from utils.jwt import *


router = APIRouter(
    prefix = "/otp",
    tags = ["otp"]
)
