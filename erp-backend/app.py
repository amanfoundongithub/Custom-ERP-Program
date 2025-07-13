
from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware

from api.routes import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router = jwt_router)
app.include_router(router = otp_router)
app.include_router(router = user_router)
app.include_router(router = company_router)
app.include_router(router = journal_router)